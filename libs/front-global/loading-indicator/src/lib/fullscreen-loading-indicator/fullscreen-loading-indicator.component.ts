import { Component, input, OnDestroy, signal } from '@angular/core';
import {
  LoadingIndicationService,
  LoadingIndicatorState,
} from '@lotus/front-global/user-service-wraps';
import { filter, Observable, of, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'lotus-web-fullscreen-loading-indicator',
  templateUrl: './fullscreen-loading-indicator.component.html',
  styleUrls: ['./fullscreen-loading-indicator.component.scss'],
  standalone: false,
})
export class FullscreenLoadingIndicatorComponent implements OnDestroy {
  private listeners: Subscription[] = [];
  loaderListener: Observable<LoadingIndicatorState>;
  showCloseCount = signal(0);
  readonly width = input(100);

  /**
   *
   */
  constructor(private loading: LoadingIndicationService) {
    this.loaderListener = this.loading.getObservable().pipe();
    this.listeners.push(this.loaderListener.subscribe(a => {
      this.showCloseCount.update(a => a + 1)
    }))
  }

  showClose() {
    if (this.showCloseCount() > 0) {
      this.showCloseCount.update(a => a - 1)
    }
  }

  ngOnDestroy() {
    this.listeners.forEach(a => a.unsubscribe())
  }
}
