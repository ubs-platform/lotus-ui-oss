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
  InvoiceAccountDTO,
  InvoiceAddressDto,
  PaymentItemDto,
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
  items = signal<PaymentItemDto[]>([]);

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
          this.basicOverlay.alert('Hata oluştu', err, 'error');
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
                this.basicOverlay.alert('Hata oluştu', err, 'error');
              },
            });

          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || 'Fatura bilgisi alınamadı');
          this.basicOverlay.alert('Hata oluştu', err, 'error');
        },
      });
    });
  }

  downloadInvoiceFile() {
    if (!this.invoiceId) {
      this.basicOverlay.alert('Hata', 'Fatura bilgisi bulunamadı.', 'error');
      return;
    }

    const url = `/api/file/POSTRAL_INVOICE/${this.invoiceId}`;
    window.open(url, '_blank');
  }

  importInvoiceFile() {
    if (!this.invoiceId) {
      this.basicOverlay.alert('Hata', 'Fatura bilgisi bulunamadı.', 'error');
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
                  'Başarılı',
                  'Fatura başarıyla yüklendi.',
                  'success'
                );
                this.hasInvoiceFile.set(true);
              },
              error: (err) => {
                this.basicOverlay.alert('Hata oluştu', err, 'error');
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
        'Faturayı Sonlandır',
        'Bu faturayı sonlandırmak istediğinizden emin misiniz? Sonlandırma işlemi geri alınamaz.'
      )
    );

    if (!confirmed) return;

    this.invoiceService.finalize(this.invoiceId).subscribe({
      next: (updatedInvoice) => {
        this.invoiceInfo.set(updatedInvoice);
        this.basicOverlay.alert('Başarılı', 'Fatura sonlandırıldı', 'success');
      },
      error: (err) => {
        this.basicOverlay.alert('Hata oluştu', err, 'error');
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
        'Faturayı Sil',
        'Bu faturayı silmek istediğinizden emin misiniz?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.invoiceService.delete(this.invoiceId).subscribe({
            next: () => {
              this.basicOverlay.alert('Başarılı', 'Fatura silindi', 'success');
              this.router.navigate(['..', 'history'], {
                relativeTo: this.activeRoute,
              });
            },
            error: (err) => {
              this.basicOverlay.alert('Hata oluştu', err, 'error');
            },
          });
        }
      });
  }

  /**
   * İşletmeci fatura adresini döner
   */
  getSellerAddress(): Optional<InvoiceAddressDto> {
    return this.invoiceInfo()?.sellerInvoiceAddress || null;
  }

  /**
   * İşletmeci hesap bilgisini döner
   */
  getSellerAccount(): Optional<InvoiceAccountDTO> {
    return this.invoiceInfo()?.sellerInvoiceAccount || null;
  }

  /**
   * Müşteri fatura adresini döner
   */
  getCustomerAddress(): Optional<InvoiceAddressDto> {
    return this.invoiceInfo()?.customerInvoiceAddress || null;
  }

  /**
   * Müşteri hesap bilgisini döner
   */
  getCustomerAccount(): Optional<InvoiceAccountDTO> {
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
