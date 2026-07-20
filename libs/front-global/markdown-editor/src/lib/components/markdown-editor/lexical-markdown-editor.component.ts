//@ts-nocheck
// Allah belanı versin mark zuckerberg, saçma sapan typescript seçimlerin yüzünden hata da debuglayamıyorum. senin reactın da instagramın da batsın amk
// Mark Zuckerberg senin ben tüm sülaleni rm -rf / --no-preserve-root yapayım...
import {
    Component,
    input,
    output,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    viewChild,
    ElementRef,
    ViewEncapsulation,
    ChangeDetectorRef,
    signal
} from '@angular/core';
import {
    createEditor,
    LexicalEditor,
    FORMAT_TEXT_COMMAND,
    KEY_ENTER_COMMAND,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    PASTE_COMMAND,
    REDO_COMMAND, UNDO_COMMAND,
    FOCUS_COMMAND,
    BLUR_COMMAND,
    LexicalNode,
    NodeKey,
    $getRoot,
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    $insertNodes,
    $createParagraphNode,
} from 'lexical';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
    registerMarkdownShortcuts,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { FileService, FileVolatility } from '@lotus/front-global/images';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { lastValueFrom, Subscription } from 'rxjs';
import { ImageNode, $createImageNode, $isImageNode, IMAGE_TRANSFORMER } from './nodes/image.node';
import { MathInlineNode, $createMathInlineNode, $isMathInlineNode, MATH_INLINE_TRANSFORMER } from './nodes/math-inline.node';
import { MathBlockNode, $createMathBlockNode, $isMathBlockNode, MATH_BLOCK_TRANSFORMER } from './nodes/math-block.node';
import { registerHistory, createEmptyHistoryState } from '@lexical/history';
import { MarkdownFileVolatilityService } from '../../services/markdown-file-volatility.service';
// ─── Transformers ─────────────────────────────────────────────────────────────

const MARKDOWN_TRANSFORMERS = [
    MATH_BLOCK_TRANSFORMER,   // block before inline — order matters
    MATH_INLINE_TRANSFORMER,
    IMAGE_TRANSFORMER,
    ...TRANSFORMERS.filter((t) => !('regExp' in t && /---/.test((t as any).regExp?.source ?? ''))),
];

@Component({
    selector: 'lotus-web-lexical-markdown-editor,lotus-web-markdown-editor',
    templateUrl: './lexical-markdown-editor.component.html',
    styleUrls: ['./lexical-markdown-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class LexicalMarkdownEditorComponent
    implements AfterViewInit, OnChanges, OnDestroy {
    readonly category = input<string>();
    readonly objectId = input<string>();
    readonly allowWrite = input(true, { alias: 'editor' });
    readonly value = input('');
    readonly valueChange = output<string>();
    readonly placeholder = input<string | undefined>('Buraya yazın');
    readonly showToolbar = input(true);

    editorContainerRef = viewChild<ElementRef>('editorContainer');
    fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    private editor?: LexicalEditor;
    private contentEditableEl?: HTMLDivElement;
    private valueInternal = '';
    private isCreatingMathFromDollarLine = false;
    private removeUpdateListener?: () => void;
    private removeEnterCommand?: () => void;
    private unregisterHistoryFn?: () => void;
    /** URLs that have already been sent to the proxy (or are in-flight). */
    private readonly proxiedUrls = new Set<string>();
    isEditorFocused = signal(false);
    imageUrlsSnapshot: string[] = [];
    markdownVolatilityEventSubscription?: Subscription;

    constructor(
        private cdr: ChangeDetectorRef,
        private fileService: FileService,
        private basicOverlay: BasicOverlayService,
        private markdownVolatility: MarkdownFileVolatilityService
    ) { }



    ngAfterViewInit(): void {
        this.initEditor();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['value'] &&
            changes['value'].currentValue !== this.valueInternal
        ) {
            this.resetEditorContent(changes['value'].currentValue ?? '');
            this.setCurrentImageSnapshot();

        }
    }

    ngOnDestroy(): void {
        this.removeUpdateListener?.();
        this.removeEnterCommand?.();
        this.contentEditableEl?.removeEventListener('dblclick', this.onMathNodeDblClick);
        this.editor?.setRootElement(null);

        this.unregisterHistoryFn?.();
    }

    undo() {
        this.editor?.dispatchCommand(UNDO_COMMAND, undefined);
    }

    redo() {
        this.editor?.dispatchCommand(REDO_COMMAND, undefined);
    }


    private initEditor(): void {
        const container = this.editorContainerRef()?.nativeElement as HTMLElement;
        if (!container) return;

        const contentEditableDiv = document.createElement('div');
        contentEditableDiv.setAttribute('contenteditable', this.allowWrite() ? 'true' : 'false');
        contentEditableDiv.className = 'lexical-content-editable';
        contentEditableDiv.setAttribute('role', 'textbox');
        contentEditableDiv.setAttribute('spellcheck', 'true');
        if (!this.allowWrite()) {
            contentEditableDiv.setAttribute('aria-readonly', 'true');
        }
        container.appendChild(contentEditableDiv);
        this.contentEditableEl = contentEditableDiv;
        contentEditableDiv.addEventListener('dblclick', this.onMathNodeDblClick);

        this.editor = createEditor({
            namespace: 'LotusMarkdownEditor',
            nodes: [
                ImageNode,
                MathInlineNode,
                MathBlockNode,
                HeadingNode,
                QuoteNode,
                ListNode,
                ListItemNode,
                CodeNode,
                CodeHighlightNode,
                LinkNode,
                AutoLinkNode,
            ],
            onError: (error) => console.error('[LexicalMarkdownEditor]', error),
            editable: this.allowWrite(),
        });

        this.editor.setRootElement(contentEditableDiv);

        // Keyboard behaviors (backspace, enter, bold/italic shortcuts)
        registerRichText(this.editor);
        // Real-time markdown shortcuts: typing **text** → bold, *text* → italic, etc.
        registerMarkdownShortcuts(this.editor, MARKDOWN_TRANSFORMERS);
        // Typing "$$" on its own line + Enter creates a block math node
        this.registerBlockMathEnter();
        this.registerImagePasteMethod();
        this.registerUndoRedoEvents();

        // Set initial markdown content
        this.valueInternal = this.value() ?? '';
        if (this.valueInternal) {
            this.editor.update(() => {
                $convertFromMarkdownString(this.cleanMarkdown(this.valueInternal), MARKDOWN_TRANSFORMERS);
            });
        }

        // Emit markdown on every state change
        this.removeUpdateListener = this.editor.registerUpdateListener(
            ({ editorState, dirtyElements, dirtyLeaves }) => {
                // Only emit when there are actual content changes (not just selection)
                if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

                editorState.read(() => {
                    const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
                    if (markdown !== this.valueInternal) {
                        this.valueInternal = markdown;
                        this.valueChange.emit(markdown);
                        this.cdr.markForCheck();
                    }
                });

                if (this.allowWrite()) {
                    this.proxyExternalImageNodes();
                }
            }
        );

        this.editor.registerCommand(
            FOCUS_COMMAND,
            () => {
                this.isEditorFocused.set(true);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
        this.editor.registerCommand(
            BLUR_COMMAND,
            () => {
                this.isEditorFocused.set(false);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }

    private registerUndoRedoEvents() {
        if (!this.editor) return;

        // 3. Geri al/Yinele (History) durumunu kaydedin
        const historyState = createEmptyHistoryState();
        const delayBetweenStateChanges = 200; // Yazma birleştirme gecikmesi (ms)

        this.unregisterHistoryFn = registerHistory(
            this.editor,
            historyState,
            delayBetweenStateChanges
        );

        // 4. Buton durumlarını güncellemek için komutları dinleyin
        this.editor.registerCommand(
            UNDO_COMMAND,
            () => {
                // İhtiyaca göre burada özel mantıklar çalıştırılabilir
                return false; // false dönerek varsayılan Lexical undo davranışını engellemiyoruz
            },
            1
        );
        this.editor.registerCommand(
            REDO_COMMAND,
            () => {
                // İhtiyaca göre burada özel mantıklar çalıştırılabilir
                return false; // false dönerek varsayılan Lexical redo davranışını engellemiyoruz
            },
            1
        );

        this.markdownVolatilityEventSubscription = this.markdownVolatility.volatilityEvent().subscribe((event) => {
            this.updateImageVolatilities();

        });
    }

    private registerImagePasteMethod() {
        if (!this.editor) return;
        this.editor.registerCommand(
            PASTE_COMMAND,
            (event: ClipboardEvent) => {
                if (!this.allowWrite()) return false;
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (const item of items) {

                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            this.uploadImage(file).then(({ src, alt }) => {
                                this.editor?.update(() => {
                                    const imageNode = $createImageNode(src, alt);
                                    const selection = $getSelection();
                                    if ($isRangeSelection(selection)) {
                                        selection.insertNodes([imageNode]);
                                    } else {
                                        ($getRoot().getLastChild() as any)?.append(imageNode);
                                    }
                                });
                            });
                        }
                        event.preventDefault();
                        return true;
                    }
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH
        );
    }

    /**
     * When the caret is on a line containing only "$$", pressing Enter converts
     * that line into an (empty) block-math node and opens the LaTeX editor dialog.
     */
    private registerBlockMathEnter(): void {
        if (!this.editor) return;
        this.removeEnterCommand = this.editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event: KeyboardEvent | null) => {
                if (!this.allowWrite()) return false;

                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

                const topLevel = selection.anchor.getNode().getTopLevelElement();
                if (!topLevel) return false;

                const rawText = topLevel.getTextContent().replace(/\u200B/g, '').trim();
                if (rawText !== '$$') return false;

                event?.preventDefault();

                // Block math is a top-level (root) node so the multiline
                // markdown transformer can export/import it across lines.
                const mathNode = $createMathBlockNode('');
                topLevel.replace(mathNode);

                // Trailing empty paragraph so the user can keep typing after the block
                const after = $createParagraphNode();
                mathNode.insertAfter(after);
                after.selectStart();

                const nodeKey = mathNode.getKey();
                queueMicrotask(() => this.openMathPromptForNode(nodeKey, true, '', true));
                return true;
            },
            COMMAND_PRIORITY_HIGH
        );
    }

    private openMathPromptForNode(
        nodeKey: NodeKey,
        isBlock: boolean,
        initialMathValue: string,
        removeOnEmpty = false
    ): void {
        this.basicOverlay
            .textInputBasic(
                isBlock
                    ? 'Blok matematik ifadesi girin (LaTeX)'
                    : 'Satır içi matematik ifadesi girin (LaTeX)',
                initialMathValue,
                isBlock
            )
            .subscribe((math?: string | null) => {
                const value = (math ?? '').trim();

                if (!this.editor) {
                    this.isCreatingMathFromDollarLine = false;
                    return;
                }

                this.editor.update(() => {
                    const node = $getNodeByKey(nodeKey);
                    if (!node) return;

                    if (!value) {
                        if (removeOnEmpty && $isMathBlockNode(node)) {
                            node.remove();
                        }
                        return;
                    }

                    if ($isMathBlockNode(node)) {
                        node.replace($createMathBlockNode(value));
                        return;
                    }

                    if ($isMathInlineNode(node)) {
                        node.replace($createMathInlineNode(value));
                    }
                });

                this.isCreatingMathFromDollarLine = false;
            });
    }

    private onMathNodeDblClick = (event: MouseEvent): void => {
        if (!this.allowWrite() || !this.editor) return;

        const target = event.target as HTMLElement | null;
        const mathEl = target?.closest('.math-inline, .math-block') as HTMLElement | null;
        if (!mathEl) return;

        const nodeKey = mathEl.dataset["lexicalMathKey"];
        if (!nodeKey) return;

        let isBlock = false;
        let initialMathValue = '';
        this.editor.getEditorState().read(() => {
            const node = $getNodeByKey(nodeKey);
            isBlock = $isMathBlockNode(node);
            if ($isMathBlockNode(node) || $isMathInlineNode(node)) {
                initialMathValue = node.getMath();
            }
        });
        this.openMathPromptForNode(nodeKey, isBlock, initialMathValue);
    };

    private resetEditorContent(newValue: string): void {
        this.valueInternal = newValue ?? '';
        if (!this.editor) return;
        this.editor.update(() => {
            $convertFromMarkdownString(this.cleanMarkdown(this.valueInternal), MARKDOWN_TRANSFORMERS);
        });
    }

    /** Strip HTML line-break tags that may come from legacy Milkdown content */
    private cleanMarkdown(md: string): string {
        return (md ?? '').replace(/<br\s*\/?>/gi, '\n');
    }

    // ─── External image proxy ──────────────────────────────────────────────────

    /**
     * Returns true when `src` points to an external host that should be proxied.
     * Local paths (starting with `/`) and URLs on `lotus.tetakent.com` are
     * considered already-served resources and are left untouched.
     */
    private isExternalUrl(src: string): boolean {
        if (!src || src.startsWith('/')) return false;
        if (src.includes('lotus.tetakent.com')) return false;
        return src.startsWith('http://') || src.startsWith('https://');
    }

    /**
     * Scans the current editor state for ImageNodes whose src is an external URL,
     * uploads them through the file-service proxy endpoint, and replaces the src
     * with the resulting local `/api/file/{category}/{name}` path.
     *
     * Each URL is processed at most once per component lifetime (`proxiedUrls`
     * set prevents duplicate requests even when the update listener fires
     * multiple times before the async call completes).
     */
    private proxyExternalImageNodes(): void {
        if (!this.editor) return;

        const toProxy: { key: NodeKey; src: string }[] = [];

        this.editor.getEditorState().read(() => {
            const walk = (node: LexicalNode) => {
                if ($isImageNode(node)) {
                    const src = node.getSrc();
                    if (this.isExternalUrl(src) && !this.proxiedUrls.has(src)) {
                        toProxy.push({ key: node.getKey(), src });
                    }
                    return;
                }
                if (typeof (node as any).getChildren === 'function') {
                    for (const child of (node as any).getChildren() as LexicalNode[]) {
                        walk(child);
                    }
                }
            };
            walk($getRoot());
        });

        for (const { key, src } of toProxy) {
            this.proxiedUrls.add(src);
            this.fileService
                .proxyExternalImageUrl(src, this.category() ?? 'GENERAL')
                .subscribe({
                    next: ({ category, name }) => {
                        this.editor?.update(() => {
                            const node = $getNodeByKey(key);
                            if ($isImageNode(node)) {
                                node.getWritable().__src = `/api/file/${category}/${name}`;
                            }
                        });
                    },
                    error: (err) => {
                        console.warn('[LexicalMarkdownEditor] Failed to proxy image:', src, err);
                    },
                });
        }
    }

    // ─── Image upload ──────────────────────────────────────────────────────────

    showInsertImg(): void {
        this.fileInputRef()?.nativeElement.click();
    }

    async afterImageSelected(): Promise<void> {
        const files = this.fileInputRef()?.nativeElement.files;
        if (!files?.length) return;
        const { src, alt } = await this.uploadImage(files[0]);
        this.editor?.update(() => {
            const imageNode = $createImageNode(src, alt);
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.insertNodes([imageNode]);
            } else {
                ($getRoot().getLastChild() as any)?.append(imageNode);
            }
        });
        this.fileInputRef()!.nativeElement.value = '';
    }

    private async uploadImage(image: File): Promise<{ src: string; alt: string }> {
        const cat = await lastValueFrom(
            this.fileService.upload(image, this.category() || 'GENERAL', this.objectId())
        );
        return {
            src: `/api/file/${cat.category}/${cat.name}`,
            alt: image.name,
        };
    }

    // ─── Toolbar ───────────────────────────────────────────────────────────────

    /** Prevents the toolbar button mousedown from stealing focus away from the editor */
    keepFocus(event: MouseEvent): void {
        event.preventDefault();
    }

    makeBold(): void {
        this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    }

    makeItalic(): void {
        this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    }

    insertInlineMath(): void {
        this.basicOverlay
            .textInputBasic('Satır içi matematik ifadesi girin (LaTeX)', '')
            .subscribe((math?: string | null) => {
                if (math?.trim()) {
                    this.insertMathNode(math.trim(), false);
                }
            });
    }

    insertBlockMath(): void {
        this.basicOverlay
            .textInputBasic('Blok matematik ifadesi girin (LaTeX)', '', true)
            .subscribe((math?: string | null) => {
                if (math?.trim()) {
                    this.insertMathNode(math.trim(), true);
                }
            });
    }

    /**
     * Inserts a math node at the current selection. Block nodes are lifted to the
     * root level (with a trailing paragraph) so the surrounding structure stays
     * valid, pressing Enter afterwards no longer corrupts the document, and the
     * multiline markdown transformer can round-trip them across lines.
     */
    private insertMathNode(math: string, isBlock: boolean): void {
        if (!this.editor) return;
        this.editor.update(() => {
            if (isBlock) {
                $insertNodeToNearestRoot($createMathBlockNode(math));
            } else {
                $insertNodes([$createMathInlineNode(math)]);
            }
        });
    }

    /**
     * Extracts local `/api/file/...` image URLs directly from the markdown
     * string (`valueInternal`) instead of walking the Lexical editor tree.
     *
     * Editor.update() does not commit synchronously (reconciliation happens
     * on a microtask unless {discrete: true} is passed), so reading
     * getEditorState() right after resetEditorContent()/initEditor() can
     * return a stale tree that is missing just-inserted images. That caused
     * legitimate images to be misdetected as "removed" and marked volatile,
     * leading to their deletion. valueInternal is set synchronously, so
     * parsing it avoids that race entirely.
     */
    private collectImageUrls(): string[] {
        const urls: string[] = [];
        const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
        let match: RegExpExecArray | null;
        while ((match = imageRegex.exec(this.valueInternal)) !== null) {
            const src = match[1];
            if (src.startsWith('/api/file/')) {
                urls.push(src);
            }
        }
        return urls;
    }

    public setCurrentImageSnapshot(): void {
        this.imageUrlsSnapshot = this.collectImageUrls();
    }

    public updateImageVolatilities(): void {
        const urls = this.collectImageUrls();
        const removedUrls = this.imageUrlsSnapshot?.filter((url) => !urls.includes(url)) ?? [];
        const addedUrls = urls.filter((url) => !this.imageUrlsSnapshot?.includes(url)) ?? [];

        if (addedUrls.length > 0) {
            const volatilities: FileVolatility[] = addedUrls.map((url) => {
                const parts = url.split('/');
                return { category: parts[3], name: parts[4], volatile: false };
            });
            this.fileService.updateVolatilities(volatilities).subscribe({
                next: () => {
                    console.log('[LexicalMarkdownEditor] Added volatilities:', volatilities);
                },
                error: (err) => {
                    console.warn('[LexicalMarkdownEditor] Failed to update volatilities:', err);
                },
            });
        }

        if (removedUrls.length > 0) {
            const volatilities: FileVolatility[] = removedUrls.map((url) => {
                const parts = url.split('/');
                return { category: parts[3], name: parts[4], volatile: true };
            });
            this.fileService.updateVolatilities(volatilities).subscribe({
                next: () => {
                    console.log('[LexicalMarkdownEditor] Removed volatilities:', volatilities);
                },
                error: (err) => {
                    console.warn('[LexicalMarkdownEditor] Failed to update volatilities:', err);
                },
            });
        }
        this.imageUrlsSnapshot = urls;

    }

}
