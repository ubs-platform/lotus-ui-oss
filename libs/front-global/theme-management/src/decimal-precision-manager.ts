import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DecimalPrecisionManager {
  readonly KEY_DECIMAL_PRECISION = 'decimal-precision';

  private readonly _precision = signal<2 | 4>(2);
  readonly precision = this._precision.asReadonly();

  constructor() {
    this.initializePrecision();
  }

  setPrecision(precision: 2 | 4) {
    this._precision.set(precision);
    this.persistPrecision(precision);
    return true;
  }

  togglePrecision() {
    return this.setPrecision(this._precision() === 2 ? 4 : 2);
  }

  private initializePrecision() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const storedPrecision = localStorage.getItem(this.KEY_DECIMAL_PRECISION);
    const precision = storedPrecision === '4' ? 4 : 2;

    this._precision.set(precision);
    this.applyAttribute(precision);
  }

  private persistPrecision(precision: 2 | 4) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.KEY_DECIMAL_PRECISION, String(precision));
    }

    this.applyAttribute(precision);
  }

  private applyAttribute(precision: 2 | 4) {
    document.head.parentElement?.setAttribute(
      this.KEY_DECIMAL_PRECISION,
      String(precision)
    );
  }
}
