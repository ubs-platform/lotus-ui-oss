import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InvoiceControllerService,
  PaymentItemSearchService,
} from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  InvoiceDTO,
  SnapshotAccountDTO,
  SnapshotAddressDTO,
  PaymentItemDTO,
} from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';
import { FileService } from '@lotus/front-global/images';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'invoice-info',
  standalone: false,
  templateUrl: './invoice-info.component.html',
  styleUrls: ['./invoice-info.component.scss'],
})
export class InvoiceInfoComponent implements OnInit {
  invoiceId: string = '';
  invoiceInfo = signal<Optional<InvoiceDTO>>(null);
  loading = signal<boolean>(true);
  error = signal<Optional<string>>(null);
  fileInput: HTMLInputElement | null = null;
  hasInvoiceFile = signal<boolean>(false);
  items = signal<PaymentItemDTO[]>([]);

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceControllerService,
    private basicOverlay: BasicOverlayService,
    private fileService: FileService,
    private paymentItemSearchService: PaymentItemSearchService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.invoiceId = params['invoiceId'];
      if (!this.invoiceId) {
        this.notFound();
        return;
      }

      this.loading.set(true);

      this.fileService.hasFile('POSTRAL_INVOICE', this.invoiceId).subscribe({
        next: (exists) => {

          this.hasInvoiceFile.set(exists);
        },
        error: (err) => {
          this.basicOverlay.alert('general.error-occurred', err, 'error');
        },
      });

      this.invoiceService.findById(this.invoiceId).subscribe({
        next: (invoiceInfo) => {
          if (!invoiceInfo) {
            this.notFound();
            return;
          }
          this.invoiceInfo.set(invoiceInfo);
          this.paymentItemSearchService
            .fetchPaymentItems({
              paymentId: invoiceInfo.paymentId,
              sellerAccountId: invoiceInfo.sellerInvoiceAccount?.realAccountId!,
            })
            .subscribe({
              next: (items) => {
                this.items.set(items);
              },
              error: (err) => {
                this.basicOverlay.alert('general.error-occurred', err, 'error');
              },
            });

          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || 'postral.invoice.not-found');
          this.basicOverlay.alert('general.error-occurred', err, 'error');
        },
      });
    });
  }

  downloadInvoiceFile() {
    if (!this.invoiceId) {
      this.basicOverlay.alert('general.error', 'postral.invoice.not-found', 'error');
      return;
    }

    const url = `/api/file/POSTRAL_INVOICE/${this.invoiceId}`;
    window.open(url, '_blank');
  }

  importInvoiceFile() {
    if (!this.invoiceId) {
      this.basicOverlay.alert('general.error', 'postral.invoice.not-found', 'error');
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
            .upload(file, 'POSTRAL_INVOICE', `${this.invoiceId}`)
            .subscribe({
              next: (response) => {
                this.basicOverlay.alert(
                  'general.success',
                  'postral.invoice.upload-success',
                  'success'
                );
                this.hasInvoiceFile.set(true);
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

  /**
   * Faturayı sonlandır
   */
  async finalizeInvoice(): Promise<void> {
    if (!this.invoiceId) return;

    const confirmed = await lastValueFrom(
      this.basicOverlay.confirm(
        'postral.invoice.finalize-confirm-title',
        'postral.invoice.finalize-confirm-message'
      )
    );

    if (!confirmed) return;

    this.invoiceService.finalize(this.invoiceId).subscribe({
      next: (updatedInvoice) => {
        this.invoiceInfo.set(updatedInvoice);
        this.basicOverlay.alert('general.success', 'postral.invoice.finalized-success', 'success');
      },
      error: (err) => {
        this.basicOverlay.alert('general.error-occurred', err, 'error');
      },
    });
  }

  /**
   * Faturayı sil
   */
  deleteInvoice(): void {
    if (!this.invoiceId) return;

    this.basicOverlay
      .confirm(
        'postral.invoice.delete-confirm-title',
        'postral.invoice.delete-confirm-message'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.invoiceService.delete(this.invoiceId).subscribe({
            next: () => {
              this.basicOverlay.alert('general.success', 'postral.invoice.deleted-success', 'success');
              this.router.navigate(['..', 'history'], {
                relativeTo: this.activeRoute,
              });
            },
            error: (err) => {
              this.basicOverlay.alert('general.error-occurred', err, 'error');
            },
          });
        }
      });
  }

  /**
   * İşletmeci fatura adresini döner
   */
  getSellerAddress(): Optional<SnapshotAddressDTO> {
    return this.invoiceInfo()?.sellerInvoiceAddress || null;
  }

  /**
   * İşletmeci hesap bilgisini döner
   */
  getSellerAccount(): Optional<SnapshotAccountDTO> {
    return this.invoiceInfo()?.sellerInvoiceAccount || null;
  }

  /**
   * Müşteri fatura adresini döner
   */
  getCustomerAddress(): Optional<SnapshotAddressDTO> {
    return this.invoiceInfo()?.customerInvoiceAddress || null;
  }

  /**
   * Müşteri hesap bilgisini döner
   */
  getCustomerAccount(): Optional<SnapshotAccountDTO> {
    return this.invoiceInfo()?.customerAccount || null;
  }

  private notFound(): void {
    this.router.navigateByUrl('404', { skipLocationChange: true });
  }

  downloadUblFile(): void {
    if (!this.invoiceId) return;
    this.invoiceService.downloadUblUrl(this.invoiceId);
  }
}
