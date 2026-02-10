import {
  Component,
  contentChildren,
  ContentChildren,
  ElementRef,
  HostBinding,
  OnInit,
  QueryList,
  viewChild,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { BlockNavigationDirective } from '../block-navigation.directive';
import { Rotation } from '../../types';

@Component({
  selector: 'ubs-touch-tab',
  templateUrl: './touch-tab.component.html',
  styleUrls: ['./touch-tab.component.scss'],
  standalone: false,
})
export class TouchTabComponent implements OnInit {
  backGesture = false;
  readonly initialPage = input('main');

  pageSelected = output<string>();

  scrollableArea = viewChild<ElementRef<HTMLDivElement>>('scrollableArea');

  blockPages = contentChildren(BlockNavigationDirective);
  // @ContentChildren(BlockNavigationDirective)
  // blockPages?: QueryList<BlockNavigationDirective>;

  sentBack?: string | null;
  sentForward?: string | null;
  foreground?: string | null;

  rotation: Rotation | 'HOLD' = 'HOLD';
  // gesture
  startPos?: { x: number; y: number };
  diff?: { x: number; y: number } = { x: 0, y: 0 };
  xPercent: number = 0;
  delaySecond: string = '0';

  swipeLeftPage!: string;
  swipeCurrentPage!: string;
  swipeRightPage!: string;

  previousDiff!: { x: number; y: number };
  maxSeconds: number = 0.15;

  constructor() {}

  ngAfterViewInit(): void {
    if (!this.foreground) {
      this.foreground = this.blockPages()?.[1]?.name();
    }
    
    this.scrollableArea()?.nativeElement.addEventListener('scroll', (e) => {
      const scrollableAreaReal = this.scrollableArea()?.nativeElement;
      if (scrollableAreaReal) {
        const scrollLeft = scrollableAreaReal.scrollLeft;
        const clientWidth = scrollableAreaReal.clientWidth;
        const currentIndex = Math.round(scrollLeft / clientWidth);
        const currentPage = this.blockPages()?.[currentIndex];
        if (currentPage) {
          this.pageSelected.emit(currentPage.name());
        }
      }
    });
  }

  select(t: string, sendTo: Rotation = 'FORWARD') {
    const scrollableAreaReal = this.scrollableArea()?.nativeElement;
    if (scrollableAreaReal) {
      let target = this.blockPages().findIndex((a) => a.name() == t);
      let fromScrollPx = scrollableAreaReal.scrollLeft;
      if (target > -1) {
        const scrollLength =
          target * (this.scrollableArea()!.nativeElement.clientWidth || 0);
        scrollableAreaReal.scrollBy({
          top: 0,
          left: scrollLength - scrollableAreaReal.scrollLeft,
          behavior:  "smooth",
        });
      }
    }
  }

  ngOnInit(): void {
    this.select(this.initialPage());
  }

  selectHoldAndClear(t: string) {
    this.foreground = t;
  }

  private holdAndExitAnimationMode() {
    this.sentForward = null;
    this.sentBack = null;
    this.rotation = 'HOLD';
    this.setDelay(0);
  }

  // gesture

  mouseDownGroup(e: TouchEvent) {
    this.backGesture = true;
    this.startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    this.diff = { x: 0, y: 0 };
    this.previousDiff = { x: 0, y: 0 };
    const blockPagesArray = this.blockPages() || [];
    const currentIndex = blockPagesArray.findIndex(
      (a) => this.foreground == a.name()
    );

    this.swipeLeftPage =
      currentIndex > 0 ? blockPagesArray[currentIndex - 1].name()! : '';
    this.swipeRightPage =
      blockPagesArray.length > currentIndex + 1
        ? blockPagesArray[currentIndex + 1]!.name()!
        : '';

    this.swipeCurrentPage = this.foreground!;

    // this.xPercent = this.maxSeconds;
  }

  mouseUpGroup(e: TouchEvent) {
    if (this.backGesture) {
      this.backGesture = false;
      this.swipeRightPage = null!;
      this.swipeLeftPage = null!;
      this.diff = null!;
      setTimeout(() => {
        this.holdAndExitAnimationMode();
      }, 200);
    }
  }

  mouseMoveGroup(e: TouchEvent) {
    if (this.startPos && this.backGesture) {
      this.diff = {
        x: e.touches[0].clientX - this.startPos?.x,
        y: e.touches[0].clientY - this.startPos?.y,
      };
      const differenceIsPositive = this.diff.x > 0;

      const maxMotionWidth = differenceIsPositive
        ? window.innerWidth - this.startPos.x
        : this.startPos.x;

      let now = (Math.abs(this.diff?.x) * this.maxSeconds) / maxMotionWidth;

      /**
       * Assume Prev T<sub>0</sub> and diff T<sub>1</sub>
       * ```
       * 0           100    rotationIsForward   Meaning
       * Prev---->---Diff   false               Finger is going to right
       * Diff----<---Prev   true                Finger going to left
       * ```
       */
      const fingerGoesLeft = this.previousDiff.x > this.diff.x;
      if (differenceIsPositive) {
        if (fingerGoesLeft) {
          now = this.maxSeconds - Math.abs(now);
        }
      } else {
        if (!fingerGoesLeft) {
          now = this.maxSeconds - Math.abs(now);
        }
      }

      this.setDelay(now);
      this.setSwipeRotation(fingerGoesLeft, !differenceIsPositive);
      console.debug(this.rotation);
      this.previousDiff = {
        x: e.touches[0].clientX - this.startPos?.x,
        y: e.touches[0].clientY - this.startPos?.y,
      };
      if (this.previousDiff.x != this.diff.x) e.preventDefault();
    }
  }

  private setSwipeRotation(fingerGoesLeft: boolean, negative: boolean) {
    if (negative) {
      if (this.swipeRightPage) {
        if (fingerGoesLeft) {
          this.rotation = 'FORWARD';
          this.foreground = this.swipeRightPage;
          this.sentForward = this.swipeCurrentPage;
          this.sentBack = null;
        } else {
          this.rotation = 'BACK';
          this.sentForward = null;
          this.sentBack = this.swipeRightPage;
          this.foreground = this.swipeCurrentPage;
        }
      }

      // if (rotationIsToLeft) {
      //   this.rotation = 'BACK';
      //   this.sentForward = null;
      //   this.sentBack = this.swipeCurrentPage;
      //   this.foreground = this.swipeRightPage;
      // } else {
      //   this.rotation = 'FORWARD';
      //   this.sentBack = this.swipeRightPage;
      //   this.sentForward = null;
      //   this.foreground = this.swipeCurrentPage;
      // }
    } else if (this.swipeLeftPage) {
      if (fingerGoesLeft) {
        this.rotation = 'FORWARD';
        this.sentForward = this.swipeLeftPage;
        this.sentBack = null;
        this.foreground = this.swipeCurrentPage;
      } else {
        this.rotation = 'BACK';
        this.sentBack = this.swipeCurrentPage;
        this.sentForward = null;
        this.foreground = this.swipeLeftPage;
      }
    }
  }

  setDelay(d: number) {
    if (!this.backGesture) d = 0;
    this.xPercent = -d;
    this.delaySecond = -d + 's';
  }

  // back() {
  //   this.select(this.previousPages.pop()!, 'BACK');
  // }
}
