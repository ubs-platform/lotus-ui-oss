// @ts-nocheck
import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';

export class SpoilerNode extends DecoratorNode<null> {
    spoilerContent: string;

    constructor(spoilerContent: string, key?: NodeKey) { super(key); this.spoilerContent = spoilerContent; }

    static override getType(): string { return 'spoiler'; }
    static override clone(node: SpoilerNode): SpoilerNode { return new SpoilerNode(node.spoilerContent, node.getKey()); }
    static override importJSON(data: any): SpoilerNode { return new SpoilerNode(data.spoilerContent); }
    override exportJSON(): any { return { ...super.exportJSON(), type: 'spoiler', spoilerContent: this.spoilerContent, version: 1 }; }

    override createDOM(): HTMLElement {
        const content = document.createElement('span');
        content.className = 'spoiler-content hidden';
        content.textContent = this.spoilerContent;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'spoiler-toggle block-view primary';
        button.textContent = 'Spoiler';
        button.addEventListener('click', (event) => {
            event.preventDefault();
            content.classList.toggle('hidden');
        });

        const container = document.createElement('span');
        container.className = 'spoiler';
        container.appendChild(button);
        container.appendChild(content);
        return container;
    }
    override updateDOM(prev: SpoilerNode, dom: HTMLElement): boolean {
        if (prev.spoilerContent !== this.spoilerContent) {
            dom.querySelector('.spoiler-content')!.textContent = this.spoilerContent;
        }
        return false;
    }
    override decorate(): null { return null; }
    override isInline(): boolean { return true; }
    getContent(): string { return this.spoilerContent; }
    override getTextContent(): string { return `!!${this.spoilerContent}!!`; }
}

export function $createSpoilerNode(spoilerContent: string): SpoilerNode {
    return new SpoilerNode(spoilerContent);
}

export function $isSpoilerNode(node: LexicalNode | null | undefined): node is SpoilerNode {
    return node instanceof SpoilerNode;
}

export const SPOILER_TRANSFORMER = {
    dependencies: [SpoilerNode],
    export: (node: LexicalNode) => {
        if (!$isSpoilerNode(node)) return null;
        return `!!${node.getContent()}!!`;
    },
    importRegExp: /\!\!([^!\n]+)\!\!/,
    regExp: /\!\!([^!\n]+)\!\!$/,
    replace: (textNode: LexicalNode, match: RegExpMatchArray) => {
        const [, content] = match;
        if (content?.trim()) textNode.replace($createSpoilerNode(content));
    },
    trigger: '!',
    type: 'text-match' as const,
};
