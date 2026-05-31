import {
  Component,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { InvoiceDTO } from '@tk-postral/payment-common';
import { InvoiceControllerService } from '@lotus/postral-core-frontend/client';
import { FileService } from '@lotus/front-global/images';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-invoice-list-minimal',
  standalone: false,
  templateUrl: './invoice-list-minimal.component.html',
  styleUrl: './invoice-list-minimal.component.scss',
})
export class InvoiceListMinimalComponent implements OnInit, OnChanges {
  invoices = signal<InvoiceDTO[]>([]);
  paymentId = input<string | undefined>();
  sellerPaymentOrderId = input<string | undefined>();
  // true => final olanlar
  // false => draft olanlar
  // undefined => tüm faturalar
  billingStatusFilter = input<'true' | 'false' | undefined>();
  billingExistance = signal<{ [key: string]: boolean }>({});
  loading = signal(false);
  constructor(
    private invoiceService: InvoiceControllerService,
    private fileService: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['paymentId'] ||
      changes['sellerPaymentOrderId'] ||
      changes['billingStatusFilter']
    ) {
      this.loadInvoices();
    }
  }

  ngOnInit(): void {}

  loadInvoices() {
    if (!this.paymentId() && !this.sellerPaymentOrderId()) {
      console.info('No paymentId or sellerPaymentOrderId provided');
      return;
    }
    this.loading.set(true);
    this.invoiceService
      .fetchAll({
        ...(this.paymentId() ? { paymentId: this.paymentId() } : {}),
        ...(this.sellerPaymentOrderId()
          ? { sellerPaymentOrderId: this.sellerPaymentOrderId() }
          : {}),
        ...(this.billingStatusFilter()
          ? { finalized: this.billingStatusFilter() }
          : {}),
      })
      .subscribe({
        next: (response) => {
          this.invoices.set(response);
          for (const invoice of response) {
            this.fileService.hasFile('POSTRAL_INVOICE', invoice.id).subscribe({
              next: (response) => {
                this.billingExistance.update((prev) => {
                  return { ...prev, [invoice.id]: response };
                });
              },
            });
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  downloadInvoice(invoice: InvoiceDTO) {
    this.fileService.downloadInNewTab('POSTRAL_INVOICE', invoice.id);
  }

  goToInformation(_t2: InvoiceDTO) {
    this.router.navigate(["invoice", _t2.id], {relativeTo: this.activatedRoute.parent})
  }
}
