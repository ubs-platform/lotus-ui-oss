import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentChannelConfigControllerService, PaymentControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PaymentChannelConfigDTO, PaymentDTO, PaymentItemDTO, TaxDTO } from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'lib-payment',
  standalone: false,

  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit, OnDestroy {
  readonly PAYMENT_CHECK_METHOD: 'sse' | 'interval' = 'interval';
  paymentId: any;
  //TODO: Sonra Taxlar ve Itemler PaymentDTO içinde zaten geliyorsa, onları kullan.
  paymentInfo = signal<Optional<PaymentDTO>>(null);
  paymentItems = signal<PaymentItemDTO[]>([]);
  taxes = signal<TaxDTO[]>([]);
  paymentStreamSubscription?: Observable<PaymentDTO>;
  statusStream: Subscription | null = null;
  paymentDialogRef: ReturnType<BasicOverlayService['showInstantModal']> | null = null;
  componentDestroyed = false;
  paymentChannels = signal<PaymentChannelConfigDTO[]>([]);
  /**
   *
   */
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentControllerService,
    private paymentChannelService: PaymentChannelConfigControllerService,
    private basicOverlay: BasicOverlayService
  ) { }

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
          this.paymentItems.set(paymentInfo.items);
          this.taxes.set(paymentInfo.taxes)
          this.checkPaymentStatus();
          this.activateStatusStream();
        },
        error: (err) => {
          this.basicOverlay.alert('Hata oluştu', err, 'error');
        },
      });

      this.paymentChannelService.findAllSearch().subscribe(a => {
        this.paymentChannels.set(a.content);
      })

      // this.paymentService.fetchItems(this.paymentId).subscribe({
      //   next: (paymentItems) => {
      //     this.paymentItems.set(paymentItems);
      //   },
      //   error: (err) => {
      //     this.basicOverlay.alert('Hata oluştu', err, 'error');
      //   },
      // });

      // this.paymentService.fetchTaxes(this.paymentId).subscribe((a) => {
      //   this.taxes.set(a);
      // });

      // this.
    });
  }

  private activateStatusStream() {
    // Şimdilik düz refresh atarak dinleyelim... Payment Channelda tamamlandığına dair event göndermem lazım
    // return;
    if (this.statusStream && !this.statusStream?.closed) {
      return;
    }

    if (this.PAYMENT_CHECK_METHOD === 'sse') {
      this.statusStream = this.paymentService
        .subscribePaymentStatusStream(this.paymentId)
        .subscribe({
          next: (paymentUpdate) => {
            this.checkPaymentStatus();
            // this.paymentInfo.set(paymentUpdate.data);
          },
          error: (err) => {
            this.basicOverlay.alert(
              'Ödeme durumu akışı hatası. Sayfanızı yenilemeniz gerekebilir',
              err,
              'warn'
            );
          },
        });
    } else if (this.PAYMENT_CHECK_METHOD === 'interval') {
      this.statusStream = new Subscription();
      const intervalId = setInterval(() => {
        this.checkPaymentStatus();
      }, 5000);
      this.statusStream.add(() => clearInterval(intervalId));
    }
  }

  private notFound() {
    this.router.navigateByUrl('404', { skipLocationChange: true });
  }

  ngOnDestroy(): void {
    this.componentDestroyed = true;
    this.paymentDialogRef?.close();
    this.paymentDialogRef = null;
    this.statusStream?.unsubscribe();
    this.statusStream = null;
    if (
      this.paymentInfo()?.paymentStatus !== 'INITIATED' &&
      this.paymentInfo()?.paymentStatus !== 'WAITING'
    ) {
      return;
    }
    this.paymentService.cancelPayment(this.paymentId).subscribe({
      next: () => {
        this.basicOverlay.alert(
          'Ödeme iptal edildi',
          'Kullanıcı ödeme sayfasından ayrıldı',
          'info'
        );
      },
      error: (err) => {
        this.basicOverlay.alert('Ödeme iptal edilemedi', err, 'error');
      },
    });
  }

  checkPaymentStatus() {
    if (this.componentDestroyed) {
      return;
    }
    this.paymentService.checkOperation(this.paymentId).subscribe({
      next: (pi) => {
        this.paymentInfo.set(pi);

        if (!pi) {
          return;
        }
        if (pi.paymentStatus === 'COMPLETED' || pi.paymentStatus === 'FAILED') {
          this.paymentDialogRef?.close();
          this.paymentDialogRef = null;
        }
        if (
          pi.paymentStatus === 'INITIATED' ||
          pi.paymentStatus === 'FAILED' ||
          pi.paymentStatus === 'COMPLETED'
        ) {
          return;
        }

        if (pi.paymentStatus === 'WAITING') {
          if (!this.statusStream || this.statusStream.closed) {
            setTimeout(() => {
              this.checkPaymentStatus();
            }, 5000);
          }
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

  startPayment(pc: PaymentChannelConfigDTO) {
    const pi = this.paymentInfo();
    if (!pi) {
      return;
    }
    this.paymentService
      .startPayment(this.paymentId, {
        paymentChannelId: pc.channelId,
        paidAmount: pi.totalAmount,
        currency: pi.currency,
      })
      .subscribe({
        next: (paymentRes) => {
          // TODO: Change with configurable value
          const prefix = location.protocol + '//' + location.host + '/service/payment/api/';
          if (paymentRes.redirectUrl) {
            this.paymentDialogRef = this.basicOverlay.showInstantModal({
              url: prefix + paymentRes.redirectUrl + '?redirectUrl=' + encodeURIComponent(location.href),
              width: '90%',
              height: '80%',
              header: true,
            });
          }
          // window.open(, '_blank');

          this.checkPaymentStatus();

          // this.basicOverlay.alert("Ödeme alındı", "Ödeme başarıyla alındı", "success");
        },
        error: (err) => {
          this.basicOverlay.alert('Ödeme alınamadı', err, 'error');
        },
      });
  }
}
