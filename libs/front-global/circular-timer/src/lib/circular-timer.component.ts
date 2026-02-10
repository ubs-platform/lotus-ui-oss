import {
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  input,
  signal
} from '@angular/core';
import { Subject, timer } from 'rxjs';
import { delay, takeUntil, takeWhile } from 'rxjs/operators';

export type StartDate = Date | string | number;

@Component({
    selector: 'circular-timer',
    templateUrl: './circular-timer.component.html',
    styleUrls: ['./circular-timer.component.scss'],
    standalone: false
})
export class CircularTimerComponent implements OnInit, OnDestroy {
  readonly startDate = input<string>(); // only to set initial state (ngOnInit)
  readonly duration = input(0); // milliseconds
  @Output() onComplete = new EventEmitter<boolean>();

  destroy$ = new Subject<void>();

  startTime = signal(0);
  timeLeft = signal(0);
  ticking = signal(false);
  completed = signal(false);
  formattedTimeLeft = signal('');

  readonly fullDasharray = 283;
  dasharray = `${this.fullDasharray} ${this.fullDasharray}`;

  constructor(protected ngZone: NgZone) {}

  ngOnInit() {
    this.init(this.startDate());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init(startDate?: StartDate): void {
    this.setTimeLeft(startDate);
    this.formatTimeLeft();
    this.setDasharray();

    if (this.timeLeft() === 0) {
      this.completed.set(true);
    }
  }

  setTimeLeft(startDate?: StartDate): number {
    this.ticking.set(false);
    this.completed.set(false);
    this.destroy$.next();

    if (!startDate) {
      this.timeLeft.set(this.duration());
      return 0;
    }

    const startTime = new Date(<string>startDate).getTime();
    const endTime = startTime + this.duration();
    const timeLeftRaw = endTime - Date.now();
    if (timeLeftRaw <= 0) {
      this.timeLeft.set(0);
      return 0;
    }

    const timeLeftSeconds = timeLeftRaw / 1000;

    this.timeLeft.set(Math.floor(timeLeftSeconds) * 1000);
    return timeLeftSeconds % 1;
  }

  start(startDate?: StartDate, delayMs = 0, replaying = false): void {
    if (this.ticking()) {
      console.log('Cannot start: timer already running.');
      return;
    }

    const decimalPortion = this.setTimeLeft(startDate);
    const startDelayMs = delayMs + decimalPortion * 1000;
    this.formatTimeLeft();
    this.setDasharray();

    if (this.timeLeft() === 0) {
      this.completed.set(true);
      console.log('Cannot start: timer already completed.');
      return;
    }

    timer(startDelayMs, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.ticking.set(true);
        this.timeLeft.update(currentTimeLeft => currentTimeLeft - 1000);
        if (this.timeLeft() <= 0) {
          this.timeLeft.set(0);
          this.ticking.set(false);
          this.completed.set(true);
          this.onComplete.emit(replaying);
          this.destroy$.next();
        }

        this.formatTimeLeft();
        this.setDasharray();
      });
  }

  replay(startDate?: StartDate): void {
    this.start(startDate, 1200, true);
  }

  pause(): void {}

  continue(): void {}

  complete(): void {
    this.timeLeft.set(0);
    this.ticking.set(false);
    this.completed.set(true);
    this.destroy$.next();

    this.formatTimeLeft();
    this.setDasharray();
  }

  isTicking(): boolean {
    return this.ticking();
  }

  isCompleted(): boolean {
    return this.completed();
  }

  formatTimeLeft(): void {
    if (this.timeLeft() <= 0) {
      this.timeLeft.set(0);
    }

    const daysLeft = Math.floor(this.timeLeft() / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((this.timeLeft() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((this.timeLeft() % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((this.timeLeft() % (1000 * 60)) / 1000);

    const formattedDays = daysLeft < 10 ? `0${daysLeft}` : `${daysLeft}`;
    const formattedHours = hoursLeft < 10 ? `0${hoursLeft}` : `${hoursLeft}`;
    const formattedMinutes = minutesLeft < 10 ? `0${minutesLeft}` : `${minutesLeft}`;
    const formattedSeconds = secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`;

    this.formattedTimeLeft.set(`${formattedMinutes}:${formattedSeconds}`);

    if (formattedHours !== '00' || formattedDays !== '00') {
      this.formattedTimeLeft.set(`${formattedHours}:` + this.formattedTimeLeft());
    }

    if (formattedDays !== '00') {
      this.formattedTimeLeft.set(`${formattedDays}:` + this.formattedTimeLeft());
    }
  }

  setDasharray(): void {
    const rawFraction = this.timeLeft() / this.duration();
    const fraction = rawFraction - (1 / this.duration()) * (1 - rawFraction);
    const remaining = Math.round(fraction * this.fullDasharray);

    this.dasharray = `${remaining} ${this.fullDasharray}`;
  }
}