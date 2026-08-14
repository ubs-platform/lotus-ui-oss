import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppComissionControllerService, ExternalPlatformControllerService } from '@lotus/postral-core-frontend/client';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { AppComissionForm, ExternalPlatformForm } from '@lotus/postral-core-frontend/forms';
import { AppComissionDTO, ExternalPlatformDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'libExternalPlatformEdit',
  standalone: false,
  templateUrl: './external-platform-edit.component.html',
  styleUrls: ['./external-platform-edit.component.scss'],
})
export class ExternalPlatformEditComponent {
  instruction = signal<FormEditInstruction | null>(null);

  constructor(
    private externalPlatformService: ExternalPlatformControllerService,
    private router: Router,
    private basicOverlay: BasicOverlayService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | ExternalPlatformDTO
      | undefined;

    const data: ExternalPlatformDTO = state ?? new ExternalPlatformForm();
    const form = new Reform(ExternalPlatformForm, data);

    this.instruction.set({
      form,
      onValidationError: () => {
        this.basicOverlay.alert(
          'Doğrulama Hatası',
          'Lütfen formdaki hataları kontrol edin ve tekrar deneyin.',
          'error'
        );
      },
      beforeSave: () => true,
      saveMethod: (formData: ExternalPlatformDTO) => {
        return this.externalPlatformService.update(formData);
      },
      afterSaveSuccess: (out: ExternalPlatformDTO) => {
        this.basicOverlay.alert(
          'Başarılı',
          'Dış platform bilgisi başarıyla kaydedildi.',
          'success'
        );
        form.patchValue(out);
      },
      afterSaveError: () => {},
    } as FormEditInstruction<ExternalPlatformDTO, ExternalPlatformDTO>);
  }

  ngOnInit(): void {}
}
