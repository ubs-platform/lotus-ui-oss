import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { StatusBadgeColor } from '@lotus/front-global/status-badge';
import { RefundControllerService } from '@lotus/postral-core-frontend/client';
import { RefundRequestDTO } from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';

@Component({
  selector: 'libRefundRequestInfo',
  standalone: false,
  templateUrl: './refund-request-info.component.html',
  styleUrls: ['./refund-request-info.component.scss'],
})
export class RefundRequestInfoComponent implements OnInit {

  refundRequestId = '';
  refundRequest = signal<Optional<RefundRequestDTO>>(null);
  loading = signal<boolean>(true);
  error = signal<Optional<string>>(null);


  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private refundService: RefundControllerService,
    private basicOverlay: BasicOverlayService
  ) { }

  getStatusColor(arg0: string): StatusBadgeColor {
    arg0 = arg0.toUpperCase();

    if (arg0 === 'APPROVED') {
      return 'green';
    }

    if (arg0 === 'REJECTED') {
      return 'red';
    }

    return 'yellow';
  }


  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.refundRequestId = params['id'];
      if (!this.refundRequestId) {
        this.notFound();
        return;
      }

      this.loadRefundRequest();
    });
  }

  approve(): void {
    if (!this.refundRequestId || this.refundRequest()?.status !== 'PENDING') {
      return;
    }

    this.basicOverlay
      .confirm('İade talebini onayla', 'Bu iade talebini onaylamak istiyor musunuz?')
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.refundService.approveRefundRequest(this.refundRequestId).subscribe({
          next: (updatedRefundRequest) => {
            this.refundRequest.set(updatedRefundRequest);
            this.basicOverlay.alert(
              'Başarılı',
              'İade talebi onaylandı.',
              'success'
            );
          },
          error: (err) => {
            this.basicOverlay.alert('Hata oluştu', err, 'error');
          },
        });
      });
  }

  reject(): void {
    if (!this.refundRequestId || this.refundRequest()?.status !== 'PENDING') {
      return;
    }

    this.basicOverlay
      .confirm('İade talebini reddet', 'Bu iade talebini reddetmek istiyor musunuz?')
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.refundService.rejectRefundRequest(this.refundRequestId).subscribe({
          next: (updatedRefundRequest) => {
            this.refundRequest.set(updatedRefundRequest);
            this.basicOverlay.alert(
              'Başarılı',
              'İade talebi reddedildi.',
              'success'
            );
          },
          error: (err) => {
            this.basicOverlay.alert('Hata oluştu', err, 'error');
          },
        });
      });
  }

  goToRequests(): void {
    this.router.navigate(['..', 'requests'], { relativeTo: this.activeRoute });
  }

  getStatusLabel(status: RefundRequestDTO['status']): string {
    if (status === 'APPROVED') {
      return 'Onaylandı';
    }

    if (status === 'REJECTED') {
      return 'Reddedildi';
    }

    return 'Bekliyor';
  }

  getStatusClass(status: RefundRequestDTO['status']): string {
    if (status === 'APPROVED') {
      return 'approved';
    }

    if (status === 'REJECTED') {
      return 'rejected';
    }

    return 'pending';
  }

  formatDate(value: string | Date): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleString('tr-TR');
  }

  private loadRefundRequest(): void {
    this.loading.set(true);
    this.error.set(null);

    this.refundService.getRefundRequestById(this.refundRequestId).subscribe({
      next: (refundRequest) => {
        if (!refundRequest) {
          this.notFound();
          return;
        }

        this.refundRequest.set(refundRequest);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message || 'İade talebi alınamadı.');
        this.basicOverlay.alert('Hata oluştu', err, 'error');
      },
    });
  }

  private notFound(): void {
    this.router.navigateByUrl('404', { skipLocationChange: true });
  }
}
