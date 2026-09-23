import { Component, EventEmitter, signal, computed, model } from '@angular/core';
import { PaymentItemDTO, CreateRefundRequestDTO, RefundReasonKey } from '@tk-postral/payment-common';
import { RefundControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Option } from '@lotus/legendary-front/custom-select';

@Component({
  selector: 'lib-refund-request-dialog',
  standalone: false,
  templateUrl: './refund-request-dialog.component.html',
})
export class RefundRequestDialogComponent {

  readonly reasonOptions: { key: RefundReasonKey; label: string }[] = [
    { key: 'DAMAGED', label: 'postral.refund.reason.damaged' },
    { key: 'DEFECTIVE', label: 'postral.refund.reason.defective' },
    { key: 'WRONG_ITEM', label: 'postral.refund.reason.wrong_item' },
    { key: 'MISSING_PARTS', label: 'postral.refund.reason.missing_parts' },
    { key: 'NOT_AS_DESCRIBED', label: 'postral.refund.reason.not_as_described' },
    { key: 'CHANGED_MIND', label: 'postral.refund.reason.changed_mind' },
    { key: 'OTHER', label: 'postral.refund.reason.other' },
  ];


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
  selectedReasons: Record<RefundReasonKey, boolean> = {} as Record<RefundReasonKey, boolean>;
  requestNote = '';
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
    this.selectedReasons = {} as Record<RefundReasonKey, boolean>;
    this.requestNote = '';
    this.items().forEach(item => {
      this.refundSelections[item.id!] = 0;
    });
  }

  hasSelectedAny(): boolean {
    return Object.values(this.refundSelections).some(count => count > 0);
  }

  hasSelectedReason(): boolean {
    return Object.values(this.selectedReasons).some(Boolean);
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

    if (refundItemsToSubmit.length === 0 || !this.hasSelectedReason()) {
      this.basicOverlay.alert('general.warning', 'postral.refund.validation-required', 'warn');
      return;
    }

    const dto: CreateRefundRequestDTO = {
      paymentId: this.paymentId(),
      items: refundItemsToSubmit,
      reasonKeys: this.reasonOptions
        .filter((reason) => this.selectedReasons[reason.key])
        .map((reason) => reason.key),
      requestNote: this.requestNote.trim() || undefined,
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
