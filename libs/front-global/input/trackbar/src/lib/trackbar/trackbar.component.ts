import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-trackbar',
  imports: [FormsModule],
  templateUrl: './trackbar.component.html',
  styleUrl: './trackbar.component.css',
})
export class TrackbarComponent {
  value = model(0);
  maxValue = model(100);
  minValue = model(0);
  step = model(1);

  protected readonly fillPercentage = computed(() => {
    const range = this.maxValue() - this.minValue();
    if (range <= 0) {
      return 0;
    }
    return Math.min(
      100,
      Math.max(0, ((this.value() - this.minValue()) / range) * 100),
    );
  });
}
