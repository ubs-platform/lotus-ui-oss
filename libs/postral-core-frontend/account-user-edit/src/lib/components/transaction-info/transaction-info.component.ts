import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InvoiceControllerService,
  PaymentControllerService,
  PaymentItemSearchService,
  TransactionControllerService,
} from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  InvoiceDTO,
  PaymentDTO,
  PaymentItemDTO,
  PaymentTransactionDTO,
  TaxDTO,
} from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';
import { Observable, Subscription } from 'rxjs';
import { FileService } from '@lotus/front-global/images';
import { InvoiceListMinimalComponent } from '@lotus/postral-core-frontend/invoice';
@Component({
  selector: 'transactionInfo',
  standalone: false,
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent implements OnInit {
  sellerPaymentOrderId: any;
  hasInvoice = signal(false);
  paymentItems = signal<PaymentItemDTO[]>([]);
  invoiceList = signal<InvoiceDTO[]>([]);
  transactionInfo = signal<Optional<PaymentTransactionDTO>>(null);
  paymentInfo = signal<Optional<PaymentDTO>>(null);
  fileInput?: HTMLInputElement;
  invoiceHasBeenFinalized = signal(false);
  invoiceListMinimal = viewChild<InvoiceListMinimalComponent>('invoiceListMinimal');

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentControllerService,
    private transactionService: TransactionControllerService,
    private itemSearchService: PaymentItemSearchService,
    private basicOverlay: BasicOverlayService,
    private fileService: FileService,
    private invoiceService: InvoiceControllerService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      // console.log('Transaction Component Params:', params);
      this.sellerPaymentOrderId = params['sellerPaymentOrderId'];
      if (!this.sellerPaymentOrderId) {
        this.notFound();
        return;
      }

      this.transactionService.fetchById(this.sellerPaymentOrderId).subscribe({
        next: (transactionInfo) => {
          if (!transactionInfo) {
            this.notFound();
            return;
          }
          this.transactionInfo.set(transactionInfo);
          this.paymentService.fetchPaymentInformation(transactionInfo.paymentId).subscribe({
            next: (payment) => this.paymentInfo.set(payment),
            error: () => { /* payment bilgisi opsiyonel, hata bastırılır */ },
          });
          // Target'in satıcı olarak kabul edeceğiz. Genelde müşterinin satıcıya ödeme yaptığı bir senaryo vardır. 
          // Ters durumlarda genelde "DEBIT_FROM_SELLER" durumu olacak.
          const sellerAccountId = transactionInfo.targetAccountId;
          // alert(transactionInfo.targetAccountName);
          this.itemSearchService
            .fetchPaymentItems({
              paymentId: transactionInfo.paymentId,
              sellerAccountId: sellerAccountId,
            })
            .subscribe({
              next: (paymentItems) => {
                this.paymentItems.set(paymentItems);
              },
              error: (err) => {
                this.basicOverlay.alert('general.error-occurred', err, 'error');
              },
            });
          this.fetchInvoiceExistence();
          // this.paymentItems.set(transactionInfo.items || []);
        },
        error: (err) => {
          this.basicOverlay.alert('general.error-occurred', err, 'error');
        },
      });

    });
  }

  private notFound() {
    this.router.navigateByUrl('404', { skipLocationChange: true });
  }

  uploadInvoice() {
    const transaction = this.transactionInfo();
    if (!transaction) {
      this.basicOverlay.alert('general.error', 'postral.transaction.not-found', 'error');
      return;
    }

    if (this.fileInput == null) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/pdf';
      fileInput.onchange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
          this.fileService
            .upload(
              file,
              'POSTRAL_INVOICE',
              `${transaction.paymentId}_${transaction.id}`
            )
            .subscribe({
              next: (response) => {
                this.basicOverlay.alert(
                  'general.success',
                  'postral.invoice.upload-success',
                  'success'
                );
                this.hasInvoice.set(true);
              },
              error: (err) => {
                this.basicOverlay.alert('general.error-occurred', err, 'error');
              },
            });
        }
      };
      this.fileInput = fileInput;
    }

    this.fileInput.click();
  }

  fetchInvoiceExistence() {
    this.invoiceService
      .fetchAll({ sellerPaymentOrderId: this.sellerPaymentOrderId })
      .subscribe({
        next: (invoices) => {
          this.invoiceList.set(invoices);
          this.hasInvoice.set(invoices.length > 0);
          this.invoiceHasBeenFinalized.set(
            invoices.some((invoice) => invoice.finalized)
          );
        },
        error: (err) => {
          this.basicOverlay.alert('general.error-occurred', err, 'error');
        },
      });
  }

  viewInvoice(invoiceId: string) {
    this.router.navigate(['..', '..', 'invoice', invoiceId], { relativeTo: this.activeRoute });
  }

  createInvoice() {
    const transaction = this.transactionInfo();
    if (!transaction) {
      this.basicOverlay.alert('general.error', 'postral.transaction.not-found', 'error');
      return;
    }

    this.basicOverlay
      .confirm(
        'postral.invoice.create-confirm-title',
        'postral.invoice.create-confirm-message'
      )
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.invoiceService.createFromTransaction(transaction.id!).subscribe({
          next: (invoice) => {
            this.basicOverlay.alert(
              'general.success',
              'postral.invoice.created-success',
              'success'
            );
            this.invoiceList.set([...this.invoiceList(), invoice]);
            this.hasInvoice.set(true);
            this.invoiceListMinimal()?.loadInvoices();
          },
          error: (err) => {
            this.basicOverlay.alert('general.error-occurred', err, 'error');
          },
        });
      });
  }

  confirmOpenPayment() {
    const transaction = this.transactionInfo();
    if (!transaction) return;

    // Yetki kontrolü: satıcı targetAccountId ile onaylar
    const sellerAccountId = transaction.targetAccountId;

    this.basicOverlay
      .confirm(
        'postral.invoice.confirm-open-title',
        'postral.invoice.confirm-open-message'
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.paymentService
          .confirmOpenPayment(transaction.paymentId, sellerAccountId)
          .subscribe({
            next: (payment) => {
              this.paymentInfo.set(payment);
              this.basicOverlay.alert(
                'general.success',
                'postral.invoice.confirm-open-success',
                'success'
              );
            },
            error: (err) => {
              this.basicOverlay.alert('general.error-occurred', err, 'error');
            },
          });
      });
  }
}
