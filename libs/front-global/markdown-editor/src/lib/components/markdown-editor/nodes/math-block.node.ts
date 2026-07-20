// @ts-nocheck
import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';
// @ts-ignore
import katex from 'katex';

export class MathBlockNode extends DecoratorNode<null> {
    __math: string;

    constructor(math: string, key?: NodeKey) { super(key); this.__math = math; }

    static override getType(): string { return 'math-block'; }
    static override clone(node: MathBlockNode): MathBlockNode { return new MathBlockNode(node.__math, node.getKey()); }
    static override importJSON(data: any): MathBlockNode { return new MathBlockNode(data.math); }
    override exportJSON(): any { return { ...super.exportJSON(), type: 'math-block', math: this.__math, version: 1 }; }

    override createDOM(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'math-block';
        div.dataset['lexicalMathKey'] = this.getKey();
        try { katex.render(this.__math, div, { throwOnError: false, displayMode: true }); }
        catch { div.textContent = `$$${this.__math}$$`; }
        return div;
    }
    override updateDOM(prev: MathBlockNode, dom: HTMLElement): boolean {
        if (prev.__math !== this.__math) {
            try { katex.render(this.__math, dom, { throwOnError: false, displayMode: true }); }
            catch { dom.textContent = `$$${this.__math}$$`; }
        }
        return false;
    }
    override decorate(): null { return null; }
    override isInline(): boolean { return false; }
    getMath(): string { return this.__math; }
    override getTextContent(): string { return `$$${this.__math}$$`; }
}

export function $createMathBlockNode(math: string): MathBlockNode {
    return new MathBlockNode(math);
}

export function $isMathBlockNode(node: LexicalNode | null | undefined): node is MathBlockNode {
    return node instanceof MathBlockNode;
}

// Block ($$...$$) is a multiline-element transformer so it round-trips across
// several lines during markdown import/export. A text-match transformer would
// only ever match within a single line, so an existing multi-line block would
// be imported as plain text instead of a MathBlockNode.
export const MATH_BLOCK_TRANSFORMER = {
    dependencies: [MathBlockNode],
    export: (node: LexicalNode) => {
        if (!$isMathBlockNode(node)) return null;
        return `$$\n${node.getMath()}\n$$`;
    },
    regExpStart: /^[ \t]*\$\$/,
    regExpEnd: /\$\$[ \t]*$/,
    replace: (
        rootNode: any,
        children: LexicalNode[] | null,
        _startMatch: string[],
        _endMatch: string[] | null,
        linesInBetween: string[] | null,
    ) => {
        let math = '';
        if (linesInBetween) {
            const between = [...linesInBetween];
            while (between.length && between[0].trim() === '') between.shift();
            while (between.length && between[between.length - 1].trim() === '') between.pop();
            math = between.join('\n');
        } else if (children) {
            math = children.map((c) => c.getTextContent()).join('\n');
        }
        rootNode.append($createMathBlockNode(math.trim()));
        return true;
    },
    type: 'multiline-element' as const,
};
