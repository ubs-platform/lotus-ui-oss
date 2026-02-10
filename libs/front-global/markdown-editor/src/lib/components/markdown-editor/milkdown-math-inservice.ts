import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { expectDomTypeError } from '@milkdown/exception';
//@ts-ignore
import katex, { KatexOptions } from 'katex';
import { $ctx, $inputRule, $nodeSchema, $remark } from '@milkdown/utils';
import { IndexAutoLoadElement, IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';
import { MarkdownBlockMathComponent } from '../markdown-block-math/markdown-block-math.component';
import { MilkdownPlugin } from '@milkdown/ctx';
import remarkMath from 'remark-math';
import { InputRule } from '@milkdown/prose/inputrules';
import { nodeRule } from '@milkdown/prose';
import { setAttr } from '@milkdown/utils';
import {
  editorCtx,
  editorStateCtx,
  editorViewCtx,
  editorViewOptionsCtx,
  nodesCtx,
  nodeViewCtx,
  prosePluginsCtx,
} from '@milkdown/core';
import { Transaction } from '@milkdown/prose/state';
import { Node, NodeType } from '@milkdown/prose/model';
import { listenerCtx } from '@milkdown/plugin-listener';
@Injectable()
export class MilkdownMathInService {
  inlineMathDomls: Map<Node, HTMLSpanElement> = new Map();
  readonly mathInlineId = 'math_inline';
  readonly mathBlockId = 'math_block';
  public viewContainerRef!: ViewContainerRef;
  mathStyles: boolean = false;
  public constructor(private indexAutoLoader: IndexAutoLoader) {}

  private setAttr(
    comp: ComponentRef<MarkdownBlockMathComponent>,
    value?: string
  ) {
    (comp.location.nativeElement as HTMLElement).setAttribute(
      'value',
      value || comp.instance.katexExpression()
    );

    comp.instance.katexExpressionChange.subscribe((a) => {
      (comp.location.nativeElement as HTMLElement).setAttribute('value', a);
    });
  }
  async initKatex(code: string, dom: HTMLSpanElement, ctx: any) {
    this.importMathStyles();

    while (dom.children.length) {
      dom.firstChild?.remove();
    }
    katex.render(code, dom, ctx.get(this.katexOptionsCtx.key));
  }

  // @ts-ignore
  inlineMath = $nodeSchema('math_inline', (ctx) => {
    return {
      group: 'inline',
      content: 'text*',
      inline: true,
      atom: true,
      parseDOM: [
        {
          tag: `span[data-type="${this.mathInlineId}"]`,
          getContent: (dom, schema) => {
            // console.info(dom);
            if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);
            //@ts-ignore
            return Fragment.from(schema.text(dom.dataset.value ?? ''));
          },
        },
      ],
      toDOM: (node) => {
        const code: string = node.textContent;
        const dom = this.initDom(code);
        this.inlineMathDomls.set(node, dom);
        this.initKatex(code, dom, ctx);
        // ctx.get(listenerCtx).listeners.updated.push((ctx, node, prevNode) => {

        //   this.initKatex(node.textContent, dom, ctx);
        // });
        return dom;
      },
      parseMarkdown: {
        match: (node) => node.type === 'inlineMath',
        runner: (state, node, type) => {
          //@ts-ignore
          // console.info(node.value, type);
          // state
          //   .openNode(type)
          //   //@ts-ignore
          //   .addText(node.value as string)
          //   .closeNode();

          const value = node['value'] as string;
          state.openNode(type).addText(value).closeNode();
          // const dom = ctx
          //   .get(editorViewCtx)
          //   .nodeDOM(node.position!.start.offset!);
          // if (dom instanceof HTMLElement) {
          //   console.log(dom); // Düğümün DOM öğesi
          // }
        },
      },
      toMarkdown: {
        match: (node) => node.type.name === this.mathInlineId,
        runner: (state, node) => {
          state.addNode('inlineMath', undefined, node.textContent);
          // try {
          //   ctx.get(editorStateCtx).doc.check();
          // } catch (error) {
          //   console.error(error);
          // }
        },
      },
    };
  });
  private initDom(code: string) {
    const dom = document.createElement('span');
    //@ts-ignore
    dom.dataset.type = this.mathInlineId;
    //@ts-ignore
    dom.dataset.value = code;
    return dom;
  }

  constructComponent() {
    this.importMathStyles();
    // Get the ComponentFactory for your component
    const component = this.viewContainerRef.createComponent(
      MarkdownBlockMathComponent
    );

    return component as ComponentRef<MarkdownBlockMathComponent>;
  }
  blockMath = $nodeSchema('math_block', (ctx) => {
    return {
      content: 'text*',
      group: 'block',
      marks: '',
      defining: true,
      atom: true,
      isolating: true,

      attrs: {
        value: {
          default: '',
        },
      },

      parseDOM: [
        {
          tag: `markdown-block-math`,
          preserveWhitespace: 'full',
          getAttrs: (dom) => {
            //@ts-ignore
            // this.setAttr(comp, dom.getAttribute('value'));

            return { value: dom.getAttribute('value') };
          },
        },
      ],

      toDOM: (node: Node) => {
        const comp = this.constructComponent();
        // console.info(comp);

        comp.instance.editor.set(
          (ctx.get(editorViewOptionsCtx as any) as any)?.editable?.(
            undefined as any
          ) || false
        );
        comp.instance.katexExpression.set(node.attrs['value']);

        comp.changeDetectorRef.detectChanges();
        // this.setAttr(comp, node.attrs['value']);
        const sub = comp.instance.katexExpressionChange.subscribe(() => {
          const editorState = ctx.get(editorStateCtx as any) as any;
          const editorView = ctx.get(editorViewCtx as any) as any;
          // console.info();
          editorState.doc.nodesBetween(
            editorState.selection.from,
            editorState.selection.to,
            (nodeSearch: any, position: any, parent: any, index: any) => {
              if (nodeSearch.eq(node)) {
                const transaction = editorState.tr.setNodeAttribute(
                  position,
                  'value',
                  comp.instance.katexExpression()
                );
                // editorState.apply(transaction);
                editorView.dispatch(transaction);
                // console.info(node);
              }
            }
          );
        });
        const el = comp.location.nativeElement as HTMLElement;
        el.addEventListener('close', () => {
          sub.unsubscribe();
          comp.destroy();
        });
        (
          el.querySelector('button.edit-btn') as HTMLButtonElement
        )?.addEventListener('click', (e) => {
          comp.instance.clickEvent(e);
        });
        (
          el.querySelector('button.info-btn') as HTMLButtonElement
        )?.addEventListener('click', (e) => {
          comp.instance.mathLatexInfo();
        });

        // x.tr.setNodeAttribute(node,)
        // ctx.get(nodesCtx).
        return comp.location.nativeElement;
      },
      parseMarkdown: {
        match: ({ type }) => type === 'math',
        runner: (state, node, type) => {
          //@ts-ignore
          const value = node.value as string;
          state.addNode(type, { value });
        },
      },
      toMarkdown: {
        match: (node) => node.type.name === this.mathBlockId,
        runner: (state, node) => {
          //@ts-ignore
          state.addNode('math', [], node.attrs.value);
        },
      },
    };
  });

  importMathStyles() {
    if (!this.mathStyles) {
      this.indexAutoLoader.register(
        new IndexAutoLoadElement(
          'katex-css',
          'CSS',
          'dependencies/katex/katex.min.css'
        ),
        new IndexAutoLoadElement(
          'katex-js',
          'SCRIPT',
          'dependencies/katex/katex.min.js'
        )
      );
      this.mathStyles = true;
    }
  }

  remarkMathPlugin = $remark<'remarkMath', undefined>(
    'remarkMath',
    () => remarkMath
  );

  mathInlineInputRule = $inputRule((ctx) =>
    nodeRule(/(?:\$)([^\$]+)(?:\$)$/, this.inlineMath.type(ctx), {
      beforeDispatch: ({ tr, match, start }) => {
        tr.insertText(match[1] ?? '', start + 1);
      },
    })
  );

  katexOptionsCtx = $ctx<KatexOptions, 'katexOptions'>({}, 'katexOptions');
  mathBlockInputRule = $inputRule(
    (ctx) =>
      new InputRule(/^\$\$\s$/, (state, _match, start, end) => {
        const $start = state.doc.resolve(start);
        if (
          !$start
            .node(-1)
            .canReplaceWith(
              $start.index(-1),
              $start.indexAfter(-1),
              this.blockMath.type(ctx)
            )
        )
          return null;
        return state.tr
          .delete(start, end)
          .setBlockType(start, start, this.blockMath.type(ctx));
      })
  );

  public tetakentMeth: MilkdownPlugin[] = [
    this.inlineMath,
    this.mathInlineInputRule,
    this.blockMath,
    this.mathBlockInputRule,
    this.remarkMathPlugin,
    this.katexOptionsCtx,
    //@ts-ignore
  ].flat() as any as MilkdownPlugin[];
}
