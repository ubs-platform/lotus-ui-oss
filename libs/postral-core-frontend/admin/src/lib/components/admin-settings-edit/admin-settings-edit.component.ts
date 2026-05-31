import { Component, signal } from '@angular/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { AdminSettingsControllerService } from '@lotus/postral-core-frontend/client';
import { AdminSettingsForm } from '@lotus/postral-core-frontend/forms';
import { AdminSettingsDto } from '@tk-postral/payment-common';

@Component({
  selector: 'lib-admin-settings-edit',
  standalone: false,
  templateUrl: './admin-settings-edit.component.html',
  styleUrl: './admin-settings-edit.component.scss',
})
export class AdminSettingsEditComponent {
  instruction = signal<FormEditInstruction<AdminSettingsDto, AdminSettingsDto> | null>(null);

  constructor(
    private adminSettingsService: AdminSettingsControllerService,
    private basicOverlay: BasicOverlayService
  ) {}

  ngOnInit(): void {
    this.adminSettingsService.getAdminSettings().subscribe({
      next: (data) => this.initializeForm(data ?? new AdminSettingsForm()),
      error: () => {
        this.initializeForm(new AdminSettingsForm());
        this.basicOverlay.alert(
          'Uyari',
          'Admin ayarlari yuklenemedi. Varsayilan degerlerle devam ediliyor.',
          'warn'
        );
      },
    });
  }

  private initializeForm(data: AdminSettingsDto) {
    const form = new Reform(AdminSettingsForm, data);

    this.instruction.set({
      form,
      onValidationError: () => {
        this.basicOverlay.alert(
          'Dogrulama hatasi',
          'Lutfen formdaki hatalari kontrol edin ve tekrar deneyin.',
          'error'
        );
      },
      beforeSave: () => true,
      saveMethod: (formData: AdminSettingsDto) => {
        return this.adminSettingsService.updateAdminSettings(formData);
      },
      afterSaveSuccess: (out: AdminSettingsDto) => {
        this.basicOverlay.alert(
          'Basarili',
          'Admin ayarlari basariyla kaydedildi.',
          'success'
        );
        form.patchValue(out);
      },
      afterSaveError: () => {},
    });
  }
}