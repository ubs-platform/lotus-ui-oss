import { AfterViewInit, Component, Inject, viewChild, ViewChild } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { EmailChangeApproveForm } from '../../../forms/email-change-approve.form';
import { AuthService, UserService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CircularTimerComponent } from '@lotus/front-global/circular-timer';
import { WEBDIALOG_CONFIG, IWebDialogConfig, WebdialogReference } from '@lotus/front-global/webdialog';

@Component({
  selector: 'lotus-web-email-change-step-two',
  templateUrl: './email-change-step-two.component.html',
  styleUrls: ['./email-change-step-two.component.scss'],
  standalone: false,
})
export class EmailChangeStepTwoComponent implements AfterViewInit {
  timer = viewChild<CircularTimerComponent>('timer');
  approveId: string;
  reform: Reform<EmailChangeApproveForm>;
  constructor(
    // public ref: DynamicDialogRef,
    // public config: DynamicDialogConfig<{ approveId: string }>,
    private ref: WebdialogReference<string>,
    @Inject(WEBDIALOG_CONFIG)
    private config: IWebDialogConfig<
      { approveId: string },
      string
    >,
    private authService: AuthService,
    private userService: UserService,
    private basicOverlay: BasicOverlayService,
    private dialogService: DialogService
  ) {
    console.log(JSON.stringify(config.data));
    this.approveId = config.data?.approveId!;
    this.reform = new Reform(EmailChangeApproveForm, { code: '' });
  }
  ngAfterViewInit(): void {
    this.timer()?.start();
  }

  timeOver() {
    this.basicOverlay.alert(
      'Devam edilemiyor',
      'E-Posta değiştirme için verilen jeton eskidi. Lütfen tekrar deneyiniz',
      'warn',
      true
    );
    this.ref.close();
  }

  cancel() {
    this.ref.close();
  }

  complete() {
    if (this.reform.allValidationErrors().length == 0) {
      this.userService
        .approveNewEmailRequest(this.approveId, this.reform.value.code)
        .subscribe({
          error: (e) => {
            this.basicOverlay.alert(
              'Devam edilemiyor',
              e.error.message,
              'error',
              true
            );
          },
          next: () => {
            this.ref.close();
            this.basicOverlay.alert(
              'Email başarıyla değiştirildi',
              '',
              'success',
              false
            );
          },
        });
    } else {
      this.basicOverlay.alert(
        'Devam edilemiyor',
        'Lütfen gerekli alanları doldurunuz.',
        'error'
      );
    }
  }
}
