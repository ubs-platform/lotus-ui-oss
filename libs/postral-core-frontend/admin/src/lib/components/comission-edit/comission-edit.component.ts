import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppComissionControllerService } from '@lotus/postral-core-frontend/client';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { AppComissionForm } from '@lotus/postral-core-frontend/forms';
import { AppComissionDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'lib-comission-edit',
  standalone: false,
  templateUrl: './comission-edit.component.html',
  styleUrl: './comission-edit.component.scss',
})
export class ComissionEditComponent {
  instruction = signal<FormEditInstruction | null>(null);

  constructor(
    private appComissionService: AppComissionControllerService,
    private router: Router,
    private basicOverlay: BasicOverlayService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | AppComissionDTO
      | undefined;

    const data: AppComissionDTO = state ?? new AppComissionForm();
    const form = new Reform(AppComissionForm, data);

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
      saveMethod: (formData: AppComissionDTO) => {
        return this.appComissionService.update(formData);
      },
      afterSaveSuccess: (out: AppComissionDTO) => {
        this.basicOverlay.alert(
          'Başarılı',
          'Komisyon bilgisi başarıyla kaydedildi.',
          'success'
        );
        form.patchValue(out);
      },
      afterSaveError: () => {},
    } as FormEditInstruction<AppComissionDTO, AppComissionDTO>);
  }

  ngOnInit(): void {}
}
