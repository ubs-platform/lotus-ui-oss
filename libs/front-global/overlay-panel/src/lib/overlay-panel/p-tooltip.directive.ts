import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, Directive, ElementRef, ViewContainerRef, effect, inject, input, OnDestroy } from '@angular/core';
import { TranslatorText } from '@lotus/extra/translator-core';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

const TOOLTIP_POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
];

@Component({
  selector: 'lib-tooltip-content',
  imports: [UbsTranslatorNgxModule],
  template: '{{ text() | translate }}',
  styles: [
    ':host { display: block; max-width: 280px; padding: 6px 10px; color: var(--fg, #fff); background: var(--bg-surface, #333); border: 1px solid var(--border-color, transparent); border-radius: 4px; overflow-wrap: anywhere; pointer-events: none; }'],
})
class TooltipContentComponent {
  readonly text = input<TranslatorText>(undefined);
}

@Directive({
  selector: '[lib-tooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
  },
})
export class PTooltipDirective implements OnDestroy {
  readonly tooltip = input<TranslatorText>(undefined, { alias: 'lib-tooltip' });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef?: OverlayRef;
  private contentRef?: ComponentRef<TooltipContentComponent>;

  constructor() {
    effect(() => {
      const text = this.tooltip();
      if (this.contentRef) {
        if (text) this.contentRef.setInput('text', text);
        else this.hide();
      }
    });
  }

  show(): void {
    const text = this.tooltip();
    if (!text || this.overlayRef?.hasAttached()) return;

    this.overlayRef ??= this.overlay.create({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.element)
        .withPositions(TOOLTIP_POSITIONS)
        .withViewportMargin(8)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.contentRef = this.overlayRef.attach(new ComponentPortal(TooltipContentComponent, this.viewContainerRef));
    this.contentRef.setInput('text', text);
    this.contentRef.changeDetectorRef.detectChanges();
  }

  hide(): void {
    this.overlayRef?.detach();
    this.contentRef = undefined;
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}