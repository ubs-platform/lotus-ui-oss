import { Component, Inject } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { TranslatorText } from '@ubs-platform/translator-core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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

  complete() {
    const valErrors = this.dialogConfig.data!.reform.allValidationErrors();
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
