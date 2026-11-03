import { Component, Input } from '@angular/core';

@Component({
  selector: 'lotus-web-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input({ required: true }) ariaLabel = '';

  get normalizedValue(): number {
    return Number.isFinite(this.value)
      ? Math.min(100, Math.max(0, this.value))
      : 0;
  }
}
