import { Component } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { PasswordChangeForm } from '../../../forms/password-change.form';
import { AuthService, UserService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { DialogService } from 'primeng/dynamicdialog';
import { EmailForm } from '../../../forms/email.form';

@Component({
    selector: 'lotus-web-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: false
})
export class ChangePasswordComponent {
  reform!: Reform<PasswordChangeForm>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private basicOverlay: BasicOverlayService,
    private dialogService: DialogService
  ) {
    this.initReform();
  }

  private initReform() {
    this.reform = new Reform(PasswordChangeForm, {
      newPassword: '',
      newPasswordRepeat: '',
      currentPassword: '',
    });
  }

  sendRequest() {
    if (this.reform.allValidationErrors().length) {
      this.basicOverlay.alert(
        'Devam edilemiyor',
        'Lütfen gerekli alanları doldurunuz.',
        'error'
      );
    } else if (
      this.reform.value.newPassword != this.reform.value.newPasswordRepeat
    ) {
      this.basicOverlay.alert(
        'Devam edilemiyor',
        'Lütfen yeni parolalarınızın eşitliğinden emin olun.',
        'error'
      );
    } else {
      this.userService.changePassword(this.reform.value).subscribe(
        (a) => {
          this.initReform();
          this.basicOverlay.alert(
            'Parolanız başarıyla değiştirildi',
            '',
            'success'
          );
        },
        (e) => {
          this.basicOverlay.alert('Devam edilemiyor', e.error.message, 'error');
        }
      );
    }
  }
}
