//@ts-nocheck

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  HostListener,
  Injector,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectorRef,
  viewChild,
  input
} from '@angular/core';
import {
  commandsCtx,
  defaultValueCtx,
  Editor,
  editorViewCtx,
  editorViewOptionsCtx,
  parserCtx,
  rootCtx,
} from '@milkdown/core';
import {
  commonmark,
  toggleEmphasisCommand,
  toggleStrongCommand,
} from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { FileService, FileVolatility } from '@lotus/front-global/images';
import { lastValueFrom, Subscription } from 'rxjs';
import { upload, uploadConfig, Uploader } from '@milkdown/plugin-upload';
import { Slice, type Node } from '@milkdown/prose/model';
import { clipboard } from '@milkdown/plugin-clipboard';
import { Ctx } from '@milkdown/ctx';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

import { EditorView } from '@milkdown/prose/view';

import { Parser } from '@milkdown/transformer';
import { MilkdownMathInService } from './milkdown-math-inservice';
import { MarkdownFileVolatilityService } from '../../services/markdown-file-volatility.service';

@Component({
  selector: 'lotus-web-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MarkdownEditorComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  readonly category = input<string>();
  readonly objectId = input<string>();
  readonly allowWrite = input(true, { alias: "editor" });
  editorCurrentlyActive = false;
  readonly value = input('');
  @Output() valueChange = new EventEmitter<string>();
  editorRef = viewChild<ElementRef>('editorRef');

  fileInputForImage =
    viewChild<ElementRef<HTMLInputElement>>('fileInputForImage');
  editor?: Editor;
  readonly placeholder = input<string | undefined>('Buraya yazın');
  readonly showToolbar = input(true);
  typed: boolean = false;
  valueInternal!: string;
  mouseInTheHole: any;
  mathImported = false;
  internalFiles: string[] = [];
  volatilityEventSubcription?: Subscription;
  imageWidth: number = 1000;

  constructor(
    private imageService: FileService,
    private inj: Injector,
    private basicOverlay: BasicOverlayService,
    private viewContainerRef: ViewContainerRef,
    private mathInService: MilkdownMathInService,
    private markdownVolatilityService: MarkdownFileVolatilityService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.mathInService.viewContainerRef = viewContainerRef;
  }

  imageResize() {
    const cx = (this.editorRef()!.nativeElement as HTMLElement).clientWidth * 2;
    this.imageWidth = Math.max(480, Math.min(cx, 1000));
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.volatilityEventSubcription?.unsubscribe();
  }

  @HostListener('mouseleave') leaveMouse() {
    this.mouseInTheHole = false;
  }

  async initializeInput() {
    // this.mathStyles();

    if (this.editorRef) {
      this.editor = await Editor.make()
        .use(commonmark)
        .use(listener)
        .use(clipboard)
        .use(upload)
        .use(this.mathInService.tetakentMeth)
        .config((ctx) => {
          ctx.set(rootCtx, this.editorRef()?.nativeElement);
          ctx.set(defaultValueCtx, this.valueInternal || ' ');

          ctx.set(editorViewOptionsCtx, { editable: () => this.allowWrite() });
          ctx.update(uploadConfig.key, (prev) => ({
            ...prev,
            uploader: this.upoadDroppedImages,
          }));

          ctx
            .get(listenerCtx)
            .markdownUpdated((ctx, document, previousDocument) => {
              this.changeValue(document);
            });
        })

        .config(nord)

        .create();
      this.scanNewImageFiles();
      this.changeDetector.detectChanges();
    }

    this.volatilityEventSubcription = this.markdownVolatilityService
      .volatilityEvent()
      .subscribe(() => {
        this.volatilesOp();
      });
  }

  upoadDroppedImages: Uploader = async (files: FileList, schema: any) => {
    const images: File[] = [];
    if (this.category()) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) {
          continue;
        }

        // You can handle whatever the file type you want, we handle image here.
        if (!file.type.includes('image')) {
          continue;
        }

        images.push(file);
      }
    }

    const nodes: Node[] = await Promise.all(
      images.map(async (image) => {
        const { src, alt } = await this.uploadImage(image);
        return schema.nodes.image.createAndFill({
          src,
          alt,
        }) as Node;
      })
    );

    return nodes;
  };

  private urlWidthLimit(originalURL: string) {
    return originalURL + '?width=' + this.imageWidth;
  }

  showInsertImg() {
    this.fileInputForImage()?.nativeElement.click();
  }

  insertLink() {
    this.basicOverlay
      .textInputBasic('Linkin adresini girin')
      //@ts-ignore
      .subscribe((a?: string) => {
        if (a) {
          this.editor?.action((context) => {
            const view = context.get(editorViewCtx);
            const ac = '<a href="' + a + '" target="_blank">' + a + '</a>';
            view.pasteHTML(ac);
          });
        }
      });
  }

  collectImageSrcs(context: Ctx) {
    const newState: string[] = [];
    const view = context.get(editorViewCtx);
    view.dom.querySelectorAll('img[src^="/api/file/"]').forEach((a) => {
      newState.push(a.getAttribute('src')!.replace(/^\/api\/file\//g, ''));
    });
    return newState;
  }

  volatilesOp() {
    this.editor?.action((context) => {
      const volatileList: FileVolatility[] = [];
      const firstState = this.internalFiles;
      const newState = this.collectImageSrcs(context);
      const allItems = firstState
        .filter((item) => !newState.includes(item))
        .concat(newState);

      for (let index = 0; index < allItems.length; index++) {
        const itemName = allItems[index];
        const [category, name] = itemName.split('/');
        // const volatile: FileVolatility = ;
        if (!firstState.includes(itemName) && newState.includes(itemName)) {
          // added
          volatileList.push({ category, name, volatile: false });
        } else if (
          firstState.includes(itemName) &&
          !newState.includes(itemName)
        ) {
          volatileList.push({
            category,
            name,
            volatile: true,
            durationMiliseconds: 60000,
          });

          // removed
        }
      }
      this.imageService.updateVolatilities(volatileList).subscribe(() => {
        this.internalFiles = this.collectImageSrcs(context);
      });
    });
  }

  scanNewImageFiles() {
    this.editor?.action((context) => {
      this.internalFiles = this.collectImageSrcs(context);
    });
  }

  async afterImageSelectDialog() {
    const imgs = this.fileInputForImage()?.nativeElement.files;
    if (imgs?.length) {
      const { src, alt } = await this.uploadImage(imgs[0]);
      // const ac = `![${alt}](${src})`;
      const ac = '<img alt="' + alt + '" src="' + src + '" />';
      // this.resetEditor();
      this.editor?.action((context) => {
        const view = context.get(editorViewCtx);
        view.pasteHTML(ac);
      });
    }
  }

  private async uploadImage(image: File) {
    const cat = await lastValueFrom(
      this.imageService.upload(image, this.category() || 'GENERAL', this.objectId())
    );
    const src = `/api/file/${cat.category}/${cat.name}`;
    const alt = image.name;
    return { src, alt };
  }

  ngAfterViewInit(): void {
    this.imageResize();
    this.initializeInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'].currentValue != this.valueInternal) {
      this.resetEditor();
    }
  }

  private resetEditor() {
    this.valueInternal = this.value();
    this.changeDetector.detectChanges();
    if (this.editor) {
      (async () => {
        this.editor?.action((ctx: Ctx) => {
          this.volatilesOp();
          const view = ctx.get(editorViewCtx);
          const parser = ctx.get(parserCtx);

          this.setTextEditorValue(view, parser, this.valueInternal);
          this.scanNewImageFiles();
          this.changeDetector.detectChanges();
        });
      })();
    }
  }

  setTextEditorValue(view: EditorView, parser: Parser, valueInternal: string) {
    const newValueDoc = parser(valueInternal),
      emptyDoc = parser('');
    // if (!newValueDoc) return;
    const state1 = view.state;
    view.dispatch(
      state1.tr.replace(
        0,
        state1.doc.content.size,
        new Slice(emptyDoc.content, 0, 0)
      )
    );
    const state2 = view.state;

    view.dispatch(
      state2.tr.replace(
        0,
        state2.doc.content.size,
        new Slice(newValueDoc.content, 0, 0)
      )
    );
  }

  ngOnInit(): void {}

  changeValue($event: string | Event) {
    if ($event instanceof Event) {
      $event = ($event.target as HTMLDivElement).innerHTML;
    }
    // this.value = $event;
    this.valueInternal = $event;

    this.typed = $event.length > 0;
    this.valueChange.emit($event);
    this.changeDetector.detectChanges();

    // this.renderHtml();
  }

  makeBold() {
    this.styleDoc(toggleStrongCommand);
  }

  makeItalic() {
    this.styleDoc(toggleEmphasisCommand);
  }

  private styleDoc(cmd: { key: any }) {
    this.editor?.action((ctx) => {
      const commandManager = ctx.get(commandsCtx);
      commandManager.call(cmd.key);
    });
  }
}
