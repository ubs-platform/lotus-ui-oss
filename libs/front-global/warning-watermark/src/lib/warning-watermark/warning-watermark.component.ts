import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';

@Component({
  selector: 'lib-warning-watermark',
  imports: [CommonModule, UbsTranslatorNgxModule],
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
