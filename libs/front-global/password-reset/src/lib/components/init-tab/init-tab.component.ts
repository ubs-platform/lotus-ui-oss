import { Component, OnInit } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import {
  PasswordResetService,
  RegistrationForm,
  UserService,
} from '@lotus/front-global/auth';
import { UserDTO } from '@ubs-platform/users-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Router } from '@angular/router';
import { PasswordResetInitForm } from '../../forms/password-reset-init.form';

@Component({
    selector: 'lotus-web-init-tab',
    templateUrl: './init-tab.component.html',
    styleUrls: ['./init-tab.component.scss'],
    standalone: false
})
export class InitTabComponent implements OnInit {
  reform?: Reform<PasswordResetInitForm>;
  requestSent = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private overlay: BasicOverlayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reform = new Reform(PasswordResetInitForm);
  }

  sendRequest() {
    const val = this.reform!.value;
    if (this.reform?.allValidationErrors().length) {
      this.reform.revealAllErrors();
      this.overlay.alert('Lütfen gerekli alanları doldurunuz.', '', 'error');
    } else {
      this.passwordResetService.init(this.reform!.value.username).subscribe({
        next: () => {
          this.requestSent = true;
          // this.router.navigate(['password-reset', 'init', 'completed']);
        },
        error: (err) => {
          this.overlay.alert('Hata', err.error, 'error');
        },
      });
    }
  }
}
