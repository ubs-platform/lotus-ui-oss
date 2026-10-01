import { Directive, ElementRef, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { OnViewManager } from './on-view-manager';

@Directive({
  selector: '[onView],[outOfView],[viewVisibilityChange]',
  standalone: true,
  providers: [OnViewManager],
})
export class OnViewDirective implements OnInit, OnDestroy {
  @Output() onView = new EventEmitter<IntersectionObserverEntry>();
  @Output() outOfView = new EventEmitter<IntersectionObserverEntry>();
  @Output() viewVisibilityChange =
    new EventEmitter<IntersectionObserverEntry>();
  constructor(
    private _hostElement: ElementRef<HTMLElement>,
    private ovm: OnViewManager
  ) {

  }

  getHostElement() {
    return this._hostElement;
  }

  ngOnInit(): void {
    this.ovm.register(
      this._hostElement.nativeElement,
      this.onView,
      this.outOfView,
      this.viewVisibilityChange
    );
  }
  ngOnDestroy(): void {
    this.ovm.unregister(this._hostElement.nativeElement);
  }
}
