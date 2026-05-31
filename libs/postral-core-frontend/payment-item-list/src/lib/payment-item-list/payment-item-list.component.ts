import { Component, computed, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { PaymentItemDto, UNIT_TYPES_MAPPED } from '@tk-postral/payment-common';
import { PostralReportsModule } from '@lotus/postral-core-frontend/reports';

@Component({
  selector: 'lib-payment-item-list',
  imports: [CommonModule, FrontGlobalTableModule, PostralReportsModule],
  templateUrl: './payment-item-list.component.html',
  styleUrl: './payment-item-list.component.css',
})
export class PaymentItemListComponent {
  items = input<PaymentItemDto[]>([]);
  currency = input<string>('TRY');
  showSellerPaymentId = input<boolean>(false);
  showComissions = input<boolean>(false);

  readonly unitDescriptions = UNIT_TYPES_MAPPED;

  readonly unitDescriptionsByItemId = computed(() => {
    return this.items().reduce((acc, item) => {
      acc[item.itemId] =
        this.unitDescriptions[item.unit as keyof typeof this.unitDescriptions];
      return acc;
    }, {} as { [key: string]: string });
  });


}
