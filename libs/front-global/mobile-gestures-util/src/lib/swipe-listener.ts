import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InstantMovement } from './instant-movement.type';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

@Injectable()
export class DocumentSwipeListener {
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  private _instantMovement = new Subject<InstantMovement>();
  private lot = 0;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.setLot(0);
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });

    document.addEventListener('touchstart', (e) => {
      this.swipe(e, 'start');
    });
    document.addEventListener('touchend', (e) => {
      this.swipe(e, 'end');
    });
  }

  setLot(arg0: number) {
    setTimeout(() => {
      this.lot = arg0;
    }, 100);
  }

  getLot() {
    return this.lot;
  }

  minusLot(): void {
    setTimeout(() => {
      this.lot = this.lot - 1;
    }, 100);
  }

  plusLot(): void {
    setTimeout(() => {
      this.lot = this.lot + 1;
    }, 100);
  }

  instantSwipeListener() {
    return this._instantMovement.pipe();
  }

  swipe(e: TouchEvent, when: string): void {
    const el = e.target as HTMLElement;

    if (!el.closest('[ubs-document-swipe="disable"]')) {
      const coord: [number, number] = [
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY,
      ];
      const time = new Date().getTime();
      if (when === 'start') {
        this.swipeCoord = coord;
        this.swipeTime = time;
      } else if (when === 'end') {
        const direction = [
          coord[0] - this.swipeCoord?.[0]!,
          coord[1] - this.swipeCoord?.[1]!,
        ];
        const duration = time - this.swipeTime!;
        if (
          duration < 400 &&
          Math.abs(direction[0]) > 30 &&
          Math.abs(direction[0]) > Math.abs(direction[1] * 3)
        ) {
          if (direction[0] < 0) {
            //LtR
            this._instantMovement.next('RIGHT_TO_LEFT');
          } else {
            //RtL
            this._instantMovement.next('LEFT_TO_RIGHT');
          }
        }
      }
    }
  }
}
