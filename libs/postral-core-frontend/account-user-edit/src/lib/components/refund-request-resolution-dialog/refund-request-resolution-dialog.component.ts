import { Component, Inject } from '@angular/core';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';

export type RefundResolutionAction = 'APPROVED' | 'REJECTED';

export interface RefundResolutionDialogData {
  action: RefundResolutionAction;
}

export interface RefundResolutionDialogResult {
  resolutionNote?: string;
}

@Component({
  selector: 'lib-refund-request-resolution-dialog',
  standalone: false,
  templateUrl: './refund-request-resolution-dialog.component.html',
})
export class RefundRequestResolutionDialogComponent {
  resolutionNote = '';

  constructor(
    private dialog: WebdialogReference<RefundResolutionDialogResult | null>,
    @Inject(WEBDIALOG_CONFIG)
    public config: IWebDialogConfig<RefundResolutionDialogData, RefundResolutionDialogResult | null>,
  ) {}

  get action(): RefundResolutionAction {
    return this.config.data?.action || 'REJECTED';
  }

  close(): void {
    this.dialog.close(null);
  }

  submit(): void {
    this.dialog.close({
      resolutionNote: this.resolutionNote.trim() || undefined,
    });
  }
}