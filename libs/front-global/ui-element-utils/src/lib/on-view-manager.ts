import { EventEmitter, Injectable } from '@angular/core';
type IntersectionEvent = EventEmitter<IntersectionObserverEntry>;
export interface HTMLOnViewOperations {
  onView: IntersectionEvent;
  outOfView: IntersectionEvent;
  viewVisibilityChange: IntersectionEvent;
  intersecting: boolean;
}
@Injectable()
export class OnViewManager {
  private map = new Map<HTMLElement, HTMLOnViewOperations>();
  private _observer!: IntersectionObserver;

  constructor() {}

  register(
    element: HTMLElement,
    onView: IntersectionEvent,
    outOfView: IntersectionEvent,
    viewVisibilityChange: IntersectionEvent
  ) {
    this.initializeObserverIfNotReady();

    this.map.set(element, {
      onView,
      outOfView,
      viewVisibilityChange,
      intersecting: false,
    });
    this._observer.observe(element);
  }

  initializeObserverIfNotReady() {
    // Create an Intersection Observer instance
    if (this._observer == null) {
      this._observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const g = this.map.get(el);
          if (g) {
            g.viewVisibilityChange.emit(entry);
            if (entry.isIntersecting && !g.intersecting) {
              g.onView.emit(entry);
              g.intersecting = true;
            } else if (!entry.isIntersecting && g.intersecting) {
              g.outOfView.emit(entry);
              g.intersecting = false;
            }
          }
        });
      });
    }
  }
}
