import { Component, Inject } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { TranslatorText } from '@lotus/extra/translator-core';
import { BasicOverlayService } from '../../service';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';

export interface ReformDialogData {
  header: TranslatorText;
  reform: Reform;
  extraCheckError: () => TranslatorText | null;
  beforeSubmit?: (reform: Reform) => void | Promise<void>;
}

@Component({
  selector: 'lotus-web-reform-dialog',
  templateUrl: './reform-dialog.component.html',
  styleUrl: './reform-dialog.component.scss',
  standalone: false,
})
export class ReformDialogComponent {
  /**
   *
   */
  constructor(
    public dial: WebdialogReference<boolean>,
    @Inject(WEBDIALOG_CONFIG)
    public dialogConfig: IWebDialogConfig<ReformDialogData, boolean>,
    private overlay: BasicOverlayService
  ) {}

  async complete(): Promise<void> {
    const reform = this.dialogConfig.data!.reform;
    try {
      await this.dialogConfig.data?.beforeSubmit?.(reform);
    } catch {
      this.overlay.alert(
        'Gönderim hazırlanamadı',
        'Form gönderilmeden önceki işlem tamamlanamadı.',
        'error'
      );
      return;
    }

    const valErrors = reform.allValidationErrors();
    const extraError = this.dialogConfig.data?.extraCheckError();
    if (valErrors.length > 0) {
      this.overlay.alert(
        'Devam edilemiyor',
        'Lütfen gerekli alanları doldurunuz.',
        'error'
      );
    } else if (extraError) {
      this.overlay.alert('Devam edilemiyor', extraError, 'error');
    } else {
      this.dial.close(true);
    }
  }

  cancel() {
    this.dial.close(false);
  }
}
