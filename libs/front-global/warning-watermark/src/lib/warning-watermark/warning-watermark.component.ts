import { Component, Input } from '@angular/core';

import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

@Component({
  selector: 'lib-warning-watermark',
  imports: [UbsTranslatorNgxModule],
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
