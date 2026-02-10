import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { OnViewManager } from './on-view-manager';

@Directive({
  selector: '[onView],[outOfView],[viewVisibilityChange]',
  standalone: true,
  providers: [OnViewManager],
})
export class OnViewDirective {
  @Output() onView = new EventEmitter<IntersectionObserverEntry>();
  @Output() outOfView = new EventEmitter<IntersectionObserverEntry>();
  @Output() viewVisibilityChange =
    new EventEmitter<IntersectionObserverEntry>();
  constructor(
    private _hostElement: ElementRef<HTMLElement>,
    private ovm: OnViewManager
  ) {
    ovm.register(
      _hostElement.nativeElement,
      this.onView,
      this.outOfView,
      this.viewVisibilityChange
    );
  }

  getHostElement() {
    return this._hostElement;
  }
}
