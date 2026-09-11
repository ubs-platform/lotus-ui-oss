import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { PaymentItemDTO } from '@tk-postral/payment-common';
import { PostralReportsModule } from '@lotus/postral-core-frontend/reports';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { UNIT_TYPE_CODES } from '@lotus/postral-core-frontend/forms';

@Component({
  selector: 'lib-payment-item-list',
  imports: [
    CommonModule,
    FrontGlobalTableModule,
    PostralReportsModule,
    UbsTranslatorNgxModule,
  ],
  templateUrl: './payment-item-list.component.html',
  styleUrl: './payment-item-list.component.css',
})
export class PaymentItemListComponent {
  items = input<PaymentItemDTO[]>([]);
  currency = input<string>('TRY');
  showSellerPaymentId = input<boolean>(false);
  showComissions = input<boolean>(false);

  getUnitLabel(unit?: string): string {
    if (!unit) return 'postral.units.C62';
    if ((UNIT_TYPE_CODES as readonly string[]).includes(unit)) {
      return `postral.units.${unit}`;
    }
    return unit;
  }
}
