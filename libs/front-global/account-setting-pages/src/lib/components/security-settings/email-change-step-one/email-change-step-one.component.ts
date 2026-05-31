import { Component } from '@angular/core';
import { AuthService, UserService } from '@lotus/front-global/auth';
import { Reform } from '@lotus/front-global/minky/core';
import { EmailForm } from '../../../forms/email.form';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { EmailChangeStepTwoComponent } from '../email-change-step-two/email-change-step-two.component';

@Component({
  selector: 'lotus-web-email-change-step-one',
  templateUrl: './email-change-step-one.component.html',
  styleUrls: ['./email-change-step-one.component.scss'],
  standalone: false,
})
export class EmailChangeStepOneComponent {
  reform!: Reform<EmailForm>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private basicOverlay: BasicOverlayService,
    private dialogService: BasicOverlayService
  ) {
    this.authService.findCurrentUser().subscribe((a) => {
      this.reform = new Reform(EmailForm, { email: a.primaryEmail });
    });
  }
  sendRequestDemo() {
    this.dialogService.showComponentAsDialog(EmailChangeStepTwoComponent, {
      data: 313131,
      displayHeader: false,
      defaultOutValue: null,
    });
  }
  sendRequest() {
    if (this.reform.allValidationErrors().length == 0) {
      this.userService.setNewEmailRequest(this.reform.value.email).subscribe({
        next: (a) => {
          this.basicOverlay.showComponentAsDialog(EmailChangeStepTwoComponent, {
            data: a,
            displayHeader: false,
            defaultOutValue: null,
          });
        },
        error: (e) => {
          this.basicOverlay.alert('Devam edilemiyor', e, 'error');
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
