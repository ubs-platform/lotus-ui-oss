// @ts-nocheck
import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
// @ts-ignore
import katex from 'katex';

export class MathInlineNode extends DecoratorNode<null> {
    __math: string;

    constructor(math: string, key?: NodeKey) { super(key); this.__math = math; }

    static override getType(): string { return 'math-inline'; }
    static override clone(node: MathInlineNode): MathInlineNode { return new MathInlineNode(node.__math, node.getKey()); }
    static override importJSON(data: any): MathInlineNode { return new MathInlineNode(data.math); }
    override exportJSON(): any { return { ...super.exportJSON(), type: 'math-inline', math: this.__math, version: 1 }; }

    override createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = 'math-inline';
        span.dataset['lexicalMathKey'] = this.getKey();
        try { katex.render(this.__math, span, { throwOnError: false, displayMode: false }); }
        catch { span.textContent = `$${this.__math}$`; }
        return span;
    }
    override updateDOM(prev: MathInlineNode, dom: HTMLElement): boolean {
        if (prev.__math !== this.__math) {
            try { katex.render(this.__math, dom, { throwOnError: false, displayMode: false }); }
            catch { dom.textContent = `$${this.__math}$`; }
        }
        return false;
    }
    override decorate(): null { return null; }
    override isInline(): boolean { return true; }
    getMath(): string { return this.__math; }
    override getTextContent(): string { return `$${this.__math}$`; }
}

export function $createMathInlineNode(math: string): MathInlineNode {
    return new MathInlineNode(math);
}

export function $isMathInlineNode(node: LexicalNode | null | undefined): node is MathInlineNode {
    return node instanceof MathInlineNode;
}

export const MATH_INLINE_TRANSFORMER = {
    dependencies: [MathInlineNode],
    export: (node: LexicalNode) => {
        if (!$isMathInlineNode(node)) return null;
        return `$${node.getMath()}$`;
    },
    importRegExp: /\$([^$\n]+)\$/,
    regExp: /\$([^$\n]+)\$$/,
    replace: (textNode: LexicalNode, match: RegExpMatchArray) => {
        const [, math] = match;
        if (math?.trim()) textNode.replace($createMathInlineNode(math));
    },
    trigger: '$',
    type: 'text-match' as const,
};
