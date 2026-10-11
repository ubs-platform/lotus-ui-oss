import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FormEditInstruction, ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalStatusBadgeModule } from '@lotus/front-global/status-badge';
import { AccountControllerService, ExternalPlatformControllerService, PaymentControllerService } from '@lotus/postral-core-frontend/client';
import { CreateExternalPlatformPaymentDTO, PaymentDTO } from '@tk-postral/payment-common';
import { finalize, forkJoin, map, tap } from 'rxjs';
import { ExternalPlatformPaymentForm } from './external-platform-payment.form';
import { OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';

@Component({
  selector: 'lib-external-platform-payment',
  imports: [RouterModule, ReformDataEditComponent, FrontGlobalButtonModule, FrontGlobalStatusBadgeModule, OnpageHeaderComponent],
  templateUrl: './external-platform-payment.component.html',
  styleUrls: ['./external-platform-payment.component.scss'],
})
export class ExternalPlatformPaymentComponent implements OnInit {
  readonly instruction = signal<FormEditInstruction<ExternalPlatformPaymentForm, PaymentDTO> | null>(null);
  readonly busy = signal(false);
  readonly loadError = signal('');
  private readonly destroyRef = inject(DestroyRef);

  private readonly accounts = inject(AccountControllerService);
  private readonly platforms = inject(ExternalPlatformControllerService);
  private readonly payments = inject(PaymentControllerService);
  private readonly overlay = inject(BasicOverlayService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.route.pathFromRoot.some(route => route.snapshot.data['paymentMode'] === 'customer')) {
      this.loadError.set('Bu form yalnızca satıcılar içindir.');
      return;
    }
    forkJoin({
      sellers: this.accounts.getAll({ admin: 'false', type: 'COMMERCIAL', deactivated: 'NOT_DEACTIVATED' }),
      platforms: this.platforms.findAllSearch(0, 10000, undefined, undefined, undefined),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ sellers, platforms }) => {
        const availableSellers = sellers.filter(seller => !seller.isExternal && !seller.deactivated && seller.defaultAddressId);
        const activePlatforms = platforms.content.filter(platform => platform.active);
        if (!availableSellers.length || !activePlatforms.length) {
          this.loadError.set('Varsayılan adresi olan bir ticari satıcı hesabı ve aktif bir harici platform gereklidir.');
          return;
        }
        const data = new ExternalPlatformPaymentForm();
        if (availableSellers.length === 1) data.sellerAccountId = availableSellers[0].id;
        const form = new Reform(ExternalPlatformPaymentForm, data, {
          parameters: {
            sellerOptions: availableSellers.map(seller => ({ value: seller.id, text: seller.name })),
            platformOptions: activePlatforms.map(platform => ({ value: platform.id, text: platform.name })),
          },
        });
        this.instruction.set({
          form,
          onValidationError: () => this.overlay.alert('Form hatası', 'Lütfen zorunlu alanları kontrol edin.', 'error'),
          beforeSave: current => {
            if (this.busy()) return false;
            const items = current.value.items;
            if (!items.length || items.some(item =>
              !Number.isFinite(item.quantity) || item.quantity <= 0 ||
              !Number.isFinite(item.unitAmount) || item.unitAmount <= 0 ||
              !Number.isFinite(item.taxRate) || item.taxRate < 0 || item.taxRate > 100
            )) {
              this.overlay.alert('Kalem hatası', 'Pozitif miktar ve fiyat, 0–100 arası vergi oranı girin.', 'error');
              return false;
            }
            const total = items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);
            if (!Number.isFinite(total)) {
              this.overlay.alert('Tutar hatası', 'Geçerli bir toplam tutar girin.', 'error');
              return false;
            }
            this.busy.set(true);
            return this.overlay.confirm(
              'Harici satışı kaydet',
              `${total.toFixed(2)} ${current.value.currency} tutarındaki satış tamamlanmış olarak kaydedilecek. Yeniden tahsilat yapılmaz. Onaylıyor musunuz?`,
            ).pipe(
              map(confirmed => confirmed === true),
              tap(confirmed => { if (!confirmed) this.busy.set(false); }),
              takeUntilDestroyed(this.destroyRef),
            );
          },
          saveMethod: value => {
            const dto: CreateExternalPlatformPaymentDTO = {
              externalPlatformId: value.externalPlatformId,
              externalPlatformOrderId: value.externalPlatformOrderId.trim(),
              currency: value.currency,
              customerAccount: value.customerAccount,
              billingAddress: value.billingAddress,
              items: value.items.map(item => ({ ...item, sellerAccountId: value.sellerAccountId })),
            };
            return this.payments.createExternalPlatformPayment(dto).pipe(
              finalize(() => this.busy.set(false)),
            );
          },
          afterSaveSuccess: () => {
            this.instruction.set(null);
            this.overlay.alert('Satış kaydedildi', 'Harici satış ve satıcı siparişi oluşturuldu.', 'success');
            void this.router.navigate(['../../transaction/history'], { relativeTo: this.route });
          },
          afterSaveError: (error: unknown) => {
            let message = 'Harici satış kaydedilemedi. Lütfen sipariş listesini kontrol edin.';
            if (error instanceof HttpErrorResponse && error.error &&
                typeof error.error.message === 'string') {
              message = error.error.message;
            }
            this.overlay.alert('Kayıt hatası', message, 'error', true);
          },
        });
      },
      error: () => {
        this.loadError.set('Satıcı hesapları veya harici platformlar yüklenemedi.');
        this.overlay.alert('Yükleme hatası', this.loadError(), 'error');
      },
    });
  }
}
