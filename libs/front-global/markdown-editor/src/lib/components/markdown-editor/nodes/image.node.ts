// @ts-nocheck
import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';

export class ImageNode extends DecoratorNode<null> {
    __src: string;
    __alt: string;

    constructor(src: string, alt: string, key?: NodeKey) {
        super(key);
        this.__src = src;
        this.__alt = alt;
    }

    static override getType(): string { return 'image'; }
    static override clone(node: ImageNode): ImageNode { return new ImageNode(node.__src, node.__alt, node.getKey()); }
    static override importJSON(data: any): ImageNode { return new ImageNode(data.src, data.alt ?? ''); }
    override exportJSON(): any {
        return { ...super.exportJSON(), type: 'image', src: this.__src, alt: this.__alt, version: 1 };
    }

    override createDOM(): HTMLElement {
        const img = document.createElement('img');
        img.src = this.__src;
        img.alt = this.__alt ?? '';
        img.style.maxWidth = '100%';
        img.style.display = 'inline-block';
        return img;
    }
    override updateDOM(prev: ImageNode, dom: HTMLImageElement): boolean {
        if (prev.__src !== this.__src) dom.src = this.__src;
        if (prev.__alt !== this.__alt) dom.alt = this.__alt;
        return false;
    }
    override decorate(): null { return null; }
    override isInline(): boolean { return true; }
    getSrc(): string { return this.__src; }
    getAlt(): string { return this.__alt; }

    /**
     * Fallback used by $convertToMarkdownString when the text-match transformer
     * export function is skipped for DecoratorNode children.
     */
    override getTextContent(): string {
        return `![${this.__alt ?? ''}](${this.__src})`;
    }
}

export function $createImageNode(src: string, alt: string): ImageNode {
    return new ImageNode(src, alt);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

export const IMAGE_TRANSFORMER = {
    dependencies: [ImageNode],
    export: (node: LexicalNode) => {
        if (!$isImageNode(node)) return null;
        return `![${node.getAlt()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^\]]*)\])\(([^)]+)\)/,
    regExp: /!(?:\[([^\]]*)\])\(([^)]+)\)$/,
    replace: (textNode: LexicalNode, match: RegExpMatchArray) => {
        const [, alt, src] = match;
        if (src) textNode.replace($createImageNode(src, alt ?? ''));
    },
    trigger: ')',
    type: 'text-match' as const,
};
