import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentChannelConfigControllerService } from '@lotus/postral-core-frontend/client';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { PaymentChannelConfigForm } from '@lotus/postral-core-frontend/forms';
import { PaymentChannelConfigDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'lib-payment-channel-config-edit',
  standalone: false,
  templateUrl: './payment-channel-config-edit.component.html',
  styleUrl: './payment-channel-config-edit.component.scss',
})
export class PaymentChannelConfigEditComponent {
  instruction = signal<FormEditInstruction | null>(null);

  constructor(
    private service: PaymentChannelConfigControllerService,
    private router: Router,
    private basicOverlay: BasicOverlayService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | PaymentChannelConfigDTO
      | undefined;

    const data: PaymentChannelConfigDTO = state ?? new PaymentChannelConfigForm();
    const form = new Reform(PaymentChannelConfigForm, data);

    this.instruction.set({
      form,
      onValidationError: () => {
        this.basicOverlay.alert(
          'Doğrulama Hatası',
          'Lütfen formdaki hataları kontrol edin ve tekrar deneyin.',
          'error',
        );
      },
      beforeSave: () => true,
      saveMethod: (formData: PaymentChannelConfigDTO) => {
        return this.service.update(formData);
      },
      afterSaveSuccess: (out: PaymentChannelConfigDTO) => {
        this.basicOverlay.alert(
          'Başarılı',
          'Ödeme kanalı yapılandırması başarıyla kaydedildi.',
          'success',
        );
        form.patchValue(out);
      },
      afterSaveError: () => {},
    } as FormEditInstruction<PaymentChannelConfigDTO, PaymentChannelConfigDTO>);
  }
}
