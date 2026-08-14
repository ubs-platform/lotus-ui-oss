import { Component, EventEmitter, signal, computed, model } from '@angular/core';
import { PaymentItemDTO, CreateRefundRequestDTO } from '@tk-postral/payment-common';
import { RefundControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Option } from '@lotus/legendary-front/custom-select';

@Component({
  selector: 'lib-refund-request-dialog',
  standalone: false,
  templateUrl: './refund-request-dialog.component.html',
})
export class RefundRequestDialogComponent {


  visible = model<boolean>(false);
  paymentId = model<string>('');
  paymentItems = model<PaymentItemDTO[]>([]);
  visibleChange = new EventEmitter<boolean>();
  onSuccess = new EventEmitter<void>();

  selectedAccountId = model<string>('');
  sellerAccounts = computed(() => {
    if (!this.paymentItems()) return [];
    const accountsMap: { [key: string]: string } = {};
    this.paymentItems().forEach(item => {
      if (item.sellerAccountId && item.sellerAccountName) {
        accountsMap[item.sellerAccountId] = item.sellerAccountName;
      }
    });
    return Object.entries(accountsMap).map(([id, name]) => ({ value: id, text: name } as Option));
  });

  items = computed(() => {
    if (!this.selectedAccountId()) return [];
    if (!this.paymentItems()) return [];
    // Only show items that still have a balance to refund
    return this.paymentItems().filter(item => (item.quantity - (item.refundCount || 0)) > 0 && item.sellerAccountId === this.selectedAccountId());
  });

  refundSelections: { [key: string]: number } = {};
  submitting = signal(false);

  constructor(
    private refundService: RefundControllerService,
    private basicOverlay: BasicOverlayService
  ) { }

  ngOnChanges() {
    if (this.visible() && this.paymentId() && this.paymentItems()) {
      this.resetSelections();
    }
  }

  resetSelections() {
    this.refundSelections = {};
    this.items().forEach(item => {
      this.refundSelections[item.id!] = 0;
    });
  }

  hasSelectedAny(): boolean {
    return Object.values(this.refundSelections).some(count => count > 0);
  }

  close() {
    this.visible.set(false);
    this.visibleChange.emit(this.visible());
  }

  submitRefundRequest() {
    const refundItemsToSubmit = Object.entries(this.refundSelections)
      .filter(([itemId, refundCount]) => refundCount > 0)
      .map(([paymentItemId, refundCount]) => ({
        paymentItemId,
        refundCount
      }));

    if (refundItemsToSubmit.length === 0) {
      this.basicOverlay.alert("Uyarı", "Lütfen iade edilecek en az bir ürün adetini girin.", "warn");
      return;
    }

    const dto: CreateRefundRequestDTO = {
      paymentId: this.paymentId(),
      items: refundItemsToSubmit
    };

    this.submitting.set(true);

    this.refundService.createRefundRequest(dto).subscribe({
      next: () => {
        this.basicOverlay.alert("Başarılı", "İade isteği başarıyla oluşturuldu.", "success");
        this.submitting.set(false);
        this.onSuccess.emit();
        this.close();
      },
      error: (err) => {
        this.submitting.set(false);
        this.basicOverlay.alert("Hata", "İade isteği oluşturulurken bir hata oluştu.", "error");
      }
    });
  }
}
