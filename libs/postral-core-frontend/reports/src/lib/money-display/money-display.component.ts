import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DecimalPrecisionManager } from '@lotus/front-global/theme-management';

@Component({
  selector: 'lib-money-display',
  standalone: false,
  templateUrl: './money-display.component.html',
  styleUrl: './money-display.component.scss',
})
export class MoneyDisplayComponent {
  @Input() amount: number | null | undefined = null;
  @Input() currency: string | null | undefined = null;

  constructor(
    public decimalPrecisionManager: DecimalPrecisionManager,
    private decimalPipe: DecimalPipe
  ) {}

  get displayValue() {
    if (this.amount == null) {
      return '-';
    }

    const formatted =
      this.decimalPipe.transform(this.amount, this.displayDigits) || '-';
    return this.currency ? `${formatted} ${this.currency}` : formatted;
  }

  get tooltipValue() {
    if (!this.shouldShowTooltip || this.amount == null) {
      return '';
    }

    const formatted = this.decimalPipe.transform(this.amount, '1.4-4') || '-';
    return this.currency ? `${formatted} ${this.currency}` : formatted;
  }

  get shouldShowTooltip() {
    return this.decimalPrecisionManager.precision() === 2;
  }

  private get displayDigits() {
    return this.decimalPrecisionManager.precision() === 4 ? '1.4-4' : '1.2-2';
  }
}
