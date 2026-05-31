import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PaymentDTO, PaymentItemDto, TaxDTO } from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';
import { Observable, Subscription } from 'rxjs';
import { InvoiceListMinimalComponent } from '@lotus/postral-core-frontend/invoice';
import { RefundRequestDialogComponent } from '../refund-request-dialog/refund-request-dialog.component';

@Component({
  selector: 'payment-info',
  standalone: false,
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {
  paymentId: any;
  //TODO: Sonra Taxlar ve Itemler PaymentDTO içinde zaten geliyorsa, onları kullan.
  paymentInfo = signal<Optional<PaymentDTO>>(null);
  paymentItems = signal<PaymentItemDto[]>([]);
  taxes = signal<TaxDTO[]>([]);
  paymentStreamSubscription?: Observable<PaymentDTO>;

  refundDialogVisible = false;
  /**
   *
   */
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentControllerService,
    private basicOverlay: BasicOverlayService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      // console.log('Payment Component Params:', params);
      this.paymentId = params['paymentId'];
      if (!this.paymentId) {
        this.notFound();
        return;
      }

      this.paymentService.fetchPaymentInformationFull(this.paymentId).subscribe({
        next: (paymentInfo) => {
          if (!paymentInfo) {
            this.notFound();
            return;
          }
          this.paymentInfo.set(paymentInfo);
          this.taxes.set(paymentInfo.taxes || []);
          this.paymentItems.set(paymentInfo.items || []);
          this.checkPaymentStatus();
        },
        error: (err) => {
          this.basicOverlay.alert('Hata oluştu', err, 'error');
        },
      });
    });
  }

  private notFound() {
    this.router.navigateByUrl('404', { skipLocationChange: true });
  }



  checkPaymentStatus() {
    this.paymentService.checkOperation(this.paymentId).subscribe({
      next: (pi) => {
        this.paymentInfo.set(pi);

        if (!pi) {
          return;
        }
        if (
          pi.paymentStatus === 'INITIATED' ||
          pi.paymentStatus === 'FAILED' ||
          pi.paymentStatus === 'COMPLETED'
        ) {
          return;
        }

        if (pi.paymentStatus === 'WAITING') {
          setTimeout(() => {
            this.checkPaymentStatus();
          }, 5000);
        } else if (pi.paymentStatus === 'COMPLETED') {
          this.basicOverlay.alert(
            'Ödeme tamamlandı',
            'Ödeme başarıyla tamamlandı',
            'success'
          );
        } else if (pi.paymentStatus === 'FAILED') {
          this.basicOverlay.alert(
            'Ödeme başarısız',
            'Ödeme alınamadı',
            'error'
          );
        }
      },
      error: (err) => {
        this.basicOverlay.alert('Ödeme durumu alınamadı', err, 'error');
      },
    });

    // this.paymentService.;
  }

  startPayment() {
    const pi = this.paymentInfo();
    if (!pi) {
      return;
    }
    this.paymentService
      .startPayment(this.paymentId, {
        paymentChannelId: 'dummy-ecommerce',
        paidAmount: pi.totalAmount,
        currency: pi.currency,
      })
      .subscribe({
        next: (paymentRes) => {
          // TODO: Change with configurable value
          const prefix = 'http://localhost:3767/api/';

          paymentRes.redirectUrl &&
            window.open(prefix + paymentRes.redirectUrl, '_blank');

          this.checkPaymentStatus();

          // this.basicOverlay.alert("Ödeme alındı", "Ödeme başarıyla alındı", "success");
        },
        error: (err) => {
          this.basicOverlay.alert('Ödeme alınamadı', err, 'error');
        },
      });
  }

  showRefundDialog() {
    this.refundDialogVisible = true;
  }

  onRefundSuccess() {
    // Refresh the payment status/items after opening a refund request
    this.checkPaymentStatus();
  }
}
