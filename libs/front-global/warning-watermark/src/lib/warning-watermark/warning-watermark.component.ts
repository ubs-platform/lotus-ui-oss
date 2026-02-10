import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-warning-watermark',
  imports: [CommonModule],
  templateUrl: './warning-watermark.component.html',
  styleUrl: './warning-watermark.component.css',
})
export class WarningWatermarkComponent {
  @Input() title: string = '';
  @Input() message: string = '';

  get shouldShow(): boolean {
    return !!this.title && !!this.message;
  }
}
