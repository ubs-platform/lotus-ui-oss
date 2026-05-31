import { Component, computed, model, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountControllerService,
  CalculationService,
  ItemCrudService,
  PaymentControllerService,
} from '@lotus/postral-core-frontend/client';
import { OrderManagement } from '../../util/order-management';
import { ItemListCalculationDto } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { minky, minkyRoot, Reform } from '@lotus/front-global/minky/core';
import { lastValueFrom, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'basket',
  standalone: false,
  templateUrl: './basket-view.component.html',
  styleUrls: ['./basket-view.component.scss'],
})
export class BasketViewComponent implements OnChanges {
  orderManagement = model<OrderManagement>();
  calculationResult = model<ItemListCalculationDto>();
  itemCount = model<number>(0);
  /**
   *
   */
  constructor(
    private itemService: ItemCrudService,
    private calculationService: CalculationService,
    private basicOverlayService: BasicOverlayService,
    private paymentService: PaymentControllerService,
    private accountService: AccountControllerService,
    private router: Router,
    private activated: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderManagement']) {
      this.onInit();
    }
  }

  onInit(): void {
    this.orderManagement()?._onChange.subscribe(() => {
      this.updateCalculations();
    });
    this.updateCalculations();
  }

  updateCalculations() {
    const items = this.orderManagement()?.orders;
    if (items) {
      this.itemCount.set(items.reduce((count, order) => count + order.quantity, 0));
      this.calculationService
        .calculateTotalAmount({
          items: items,
          saleMode: 'DEFAULT',
          currency: 'TRY',
        })
        .subscribe({
          next: (calculationResult) => {
            this.calculationResult.set(calculationResult);
          },
          error: (error) => {
            this.basicOverlayService.alert(
              'Hesaplama Hatası, güncellemeler geri alınıyor',
              error?.message || '',
              'error'
            );
            this.orderManagement()?.revertChanges();
            // revert to previous items on error
            // this.orderManagement()?.setOrders(previousItems);
          },
        });
    }
  }

  onCreatePaymentClick() {
    @minkyRoot()
    class AminogluAccountSelectionDialogForm {
      @minky({
        inputType: 'select',
        selectItems: () =>
          this.accountService.getAll({ type: 'INDIVIDUAL' }).pipe(
            map((data) =>
              data.map((item) => ({
                text: item.name || item.id,
                value: item.id,
              }))
            )
          ),
      })
      customerAccountId: string = '';
    }

    const reform = new Reform(AminogluAccountSelectionDialogForm);

    this.basicOverlayService
      .reformDialog(reform, 'Müşteri Hesabı Seçimi', () => null)
      .subscribe((result) => {
        if (result) {
          const customerAccountId = reform.value.customerAccountId;
          this.paymentService
            .initialize({
              items: this.orderManagement()?.orders || [],
              currency: 'TRY',
              saleMode: 'DEFAULT',
              customerAccountId,
              type: 'PURCHASE',
            })
            .subscribe((paymentInitResult) => {
              this.basicOverlayService.alert(
                'Ödeme Başlatıldı',
                `Ödeme ID: ${paymentInitResult.id}`,
                'success'
              );
              this.router.navigate(['../payment', paymentInitResult.id], {
                relativeTo: this.activated,
              });
            });
        }
      });

  }
}
