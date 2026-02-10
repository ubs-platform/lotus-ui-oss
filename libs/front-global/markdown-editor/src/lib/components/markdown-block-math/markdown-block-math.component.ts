import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnChanges,
  Output,
  SimpleChanges,
  viewChild,
  ViewChild,
  ViewContainerRef,
  input,
  model
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { IndexAutoLoadElement, IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';

// const katex = require('katex');
import * as katex from 'katex';

@Component({
  selector: 'markdown-block-math',
  templateUrl: './markdown-block-math.component.html',
  styleUrl: './markdown-block-math.component.scss',
  standalone: false,
})
export class MarkdownBlockMathComponent implements OnChanges, AfterViewInit {
  katexBlock = viewChild<ElementRef<HTMLDivElement>>('katexBlock');
  readonly katexExpression = model('');
  @Output() katexExpressionChange = new EventEmitter();
  viewInit = false;
  readonly editor = model<Boolean>(false);

  constructor(
    public overlay: BasicOverlayService,
    private indexAutoLoader: IndexAutoLoader
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['katexExpression']) {
      this.update();
    }
  }

  update() {
    if (this.viewInit && this.katexBlock()?.nativeElement) {
      // @ts-ignore
      katex.render(this.katexExpression(), this.katexBlock().nativeElement, {});
    } else {
      console.warn('ViewInit false');
    }
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    this.update();
  }

  mathLatexInfo() {
    window.open('https://tr.wikibooks.org/wiki/LaTeX/Matematik', '_blank');
  }

  clickEvent(e: MouseEvent) {
    if (this.editor()) {
      e.preventDefault();
      e.stopImmediatePropagation();

      this.overlay
        .textInputBasic(
          'Latex ifadesini düzenleyin',
          this.katexExpression(),
          true
        )
        .subscribe((a) => {
          if (a) {
            this.katexExpression.set(a as string);
            this.update();
            this.katexExpressionChange.emit(a);
          }
        });
    }
  }
}
