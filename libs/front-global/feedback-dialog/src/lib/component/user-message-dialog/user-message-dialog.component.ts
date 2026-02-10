import { Component } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { FeedbackForm } from '../../forms/feedback.form';
import { AuthManagementService } from '@lotus/front-global/auth';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUserMessageDto } from '@ubs-platform/feedback-common';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { WebdialogReference } from '@lotus/front-global/webdialog';

@Component({
  selector: 'lotus-web-user-message-dialog',
  templateUrl: './user-message-dialog.component.html',
  styleUrls: ['./user-message-dialog.component.scss'],
  standalone: false,
})
export class UserMessageDialogComponent {
  reform = new Reform<IUserMessageDto>(FeedbackForm);
  sent: boolean = false;

  constructor(
    public auth: AuthManagementService,

    private dialogRef: WebdialogReference<boolean>,
    private feedbckService: UserMessageService,
    private translator: TranslatorRepositoryService
  ) {}

  sendFeedback() {
    if (this.reform.allValidationErrors().length) {
      this.reform.revealAllErrors();
    } else {
      const feedback = this.reform.value;
      feedback.relatedUrl = location.href;
      this.feedbckService.create(feedback).subscribe((a) => {
        this.sent = true;
      });
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.auth.userChange().subscribe((aa) => {
      if (aa) {
        this.reform.setValueByPath('firstName', aa.name);
        this.reform.setValueByPath('lastName', aa.surname);
        this.reform.setValueByPath('email', aa.primaryEmail);
        this.reform.setValueByPath(
          'localeCode',
          aa.localeCode || this.translator.getCurrentLanguage() || 'en-us'
        );
      }
    });

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
