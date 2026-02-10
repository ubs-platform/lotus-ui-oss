import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { UserMessageDialogComponent } from '../component/user-message-dialog/user-message-dialog.component';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Injectable()
export class FeedbackDialogService {
  constructor(private dialogService: BasicOverlayService) {}

  show() {
    this.dialogService.showComponentAsDialog(UserMessageDialogComponent, {
      defaultOutValue: false,
    });
  }
}
