import { DialogVisibilityReference } from '@lotus/front-global/webdialog';
import {
  ChangeDetectorRef,
  Component,
  contentChildren,
  ContentChildren,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  QueryList,
  input,
  output,
  signal,
} from '@angular/core';
import { BlockNavigationDirective } from '../block-navigation.directive';
import { Rotation } from '../../types';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'ubs-touch-pagination',
  templateUrl: './touch-pagination.component.html',
  styleUrls: ['./touch-pagination.component.scss'],
  standalone: false,
  host: {
    '[style.height]': 'height()',
    '[style.width]': 'width()',
    '[style.minHeight]': 'minHeight()',
    '[style.minWidth]': 'minWidth()',
  },
})
export class TouchPaginationComponent implements OnInit {
  backGesture = signal(false);
  height = input('80vh');
  minHeight = input('');
  minWidth = input('');
  width = input('100%');

  pageChange = output<string>();
  // @ContentChildren(BlockNavigationDirective)
  // blockPages?: QueryList<BlockNavigationDirective>;
  blockPages = contentChildren(BlockNavigationDirective);

  sentBack = signal('');
  sentForward = signal('');
  foreground = signal('');
  previousPages = signal<string[]>([]);
  rotation = signal<Rotation | 'HOLD'>('HOLD');
  // gesture
  startPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  diff = signal({ x: 0, y: 0 });
  xPercent = signal(0);
  delaySecond = signal('0');

  swipeLeftPage = signal('');
  swipeRightPage = signal('');
  previousDiff = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  maxSeconds = signal<number>(0.15);
  backButtonStates = signal<Array<DialogVisibilityReference<void>>>([]);

  constructor(
    private secondaryOverlay: BasicOverlayService,
    private chDetec: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (!this.foreground()) {
      // this.foreground.set();
      this.selectHoldAndClear(this.blockPages()?.[0]?.name()!);
      this.chDetec.detectChanges();
    }
  }

  ngOnInit(): void {}

  selectHoldAndClear(t: string) {
    this.backButtonStates().forEach((a) => a.closeManually());

    this.foreground.set(t);
    this.previousPages.set([]);
    this.backButtonStates.set([]);
  }

  select(t: string, sendTo: Rotation = 'FORWARD') {
    this.xPercent.set(0);
    const oldForeground = this.foreground();
    this.foreground.set(t);
    this.rotation.set(sendTo);
    if (sendTo == 'FORWARD') {
      this.sentForward.set(oldForeground);
      this.sentBack.set('');
      this.backButtonStates.update((a) => [
        ...a,
        this.secondaryOverlay.insertBackButtonFlag(() => {
          this.backRaw();
        }),
      ]);
    } else {
      this.sentBack.set(oldForeground);
      this.sentForward.set('');
    }

    if (!this.backGesture()) {
      setTimeout(() => {
        this.holdAndExitAnimationMode();
      }, 400);
    }
  }

  private holdAndExitAnimationMode() {
    if (this.sentForward()) {
      this.previousPages.update((a) => [...a, this.sentForward()]);
    }
    this.sentForward.set('');
    this.sentBack.set('');
    this.rotation.set('HOLD');
    this.setDelay(0);
    this.pageChange.emit(this.foreground());
  }

  // gesture

  mouseDownGroup(e: TouchEvent) {
    if (this.previousPages().length && e.target == e.currentTarget) {
      this.backGesture.set(true);
      this.startPos.set({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      this.diff.set({ x: 0, y: 0 });
      this.previousDiff.set({ x: 0, y: 0 });
      this.swipeLeftPage.set(this.previousPages().pop()!);
      this.swipeRightPage.set(this.foreground()!);
      this.xPercent.set(this.maxSeconds());
      this.setDelay(this.maxSeconds());
      this.setSwipeRotation(true);
    }
  }

  mouseUpGroup(e: TouchEvent) {
    if (this.backGesture()) {
      this.backGesture.set(false);
      this.diff.set(null!);
      setTimeout(() => {
        this.holdAndExitAnimationMode();
      }, 200);
      this.back();
    }
  }

  mouseMoveGroup(e: TouchEvent) {
    if (this.startPos() && this.backGesture()) {
      this.diff.set({
        x: e.touches[0].clientX - this.startPos().x,
        y: e.touches[0].clientY - this.startPos().y,
      });

      let now =
        (Math.max(this.diff().x) * this.maxSeconds()) /
        (window.innerWidth - this.startPos().x);
      const rotationIsForward = this.previousDiff().x > this.diff().x;
      if (rotationIsForward) {
        now = this.maxSeconds() - now;
      }
      this.setDelay(now);
      // if (rotationIsForward) now = now * -1;

      this.setSwipeRotation(rotationIsForward);
      console.debug(this.rotation);

      this.previousDiff.set({
        x: e.touches[0].clientX - this.startPos().x,
        y: e.touches[0].clientY - this.startPos().y,
      });
      if (this.previousDiff().x != this.diff().x) e.preventDefault();
    }
  }

  private setSwipeRotation(rotationIsForward: boolean) {
    if (rotationIsForward) {
      this.rotation.set('FORWARD');
      this.sentForward.set(this.swipeLeftPage());
      this.sentBack.set('');
      this.foreground.set(this.swipeRightPage());
    } else {
      this.rotation.set('BACK');
      this.sentBack.set(this.swipeRightPage());
      this.sentForward.set('');
      this.foreground.set(this.swipeLeftPage());
    }
  }

  setDelay(d: number) {
    if (!this.backGesture()) d = 0;
    this.xPercent.set(-d);
    this.delaySecond.set(-d + 's');
  }

  backRaw() {
    if (this.previousPages().length > 0) {
      const newI = this.previousPages().length - 1;
      const backTo = this.previousPages()[newI];
      this.previousPages.update((a) => a.slice(0, newI));
      this.select(backTo, 'BACK');
    }
  }

  back() {
    let bbs = this.backButtonStates();
    const newI = bbs.length - 1;
    const backTo = bbs[newI];
    this.backButtonStates();
    this.backButtonStates.update((a) => a.slice(0, newI));
    backTo?.closeMainAction();
  }
}
