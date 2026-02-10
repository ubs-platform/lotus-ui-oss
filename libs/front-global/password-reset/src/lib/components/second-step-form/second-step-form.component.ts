import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RegistrationForm,
  PasswordResetService,
} from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Reform } from '@lotus/front-global/minky/core';
import { PasswordResetInitForm } from '../../forms/password-reset-init.form';
import { PasswordResetSecondForm } from '../../forms/password-reset-second.form';
import { map } from 'rxjs';
import { LanguageManagement } from '@lotus/front-global/language-management';
@Component({
    selector: 'lotus-web-second-step-form',
    templateUrl: './second-step-form.component.html',
    styleUrls: ['./second-step-form.component.scss'],
    standalone: false
})
export class SecondStepFormComponent {
  reform?: Reform<PasswordResetSecondForm>;
  requestSent = false;
  id: any;

  constructor(
    private passwordResetService: PasswordResetService,
    private overlay: BasicOverlayService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentRoute.params.subscribe((a) => {
      const id = a['id'];
      if (id) {
        this.passwordResetService.has(id).subscribe((a) => {
          if (a) {
            this.id = id;
          } else {
            // this.router.navigate(['404']);
          }
        });
      } else {
        this.router.navigate(['404']);
      }
    });
    this.reform = new Reform(PasswordResetSecondForm);
    // LanguageManagement.registerLanguageFeeder(this.reform);
  }

  sendRequest() {
    const val = this.reform!.value;
    if (val.password != val.passwordRepeat) {
      this.reform?.revealAllErrors();
      this.overlay.alert(
        'Parola sıfırlama tamamlanamadı',
        'Parolanız uyuşmuyor.',
        'error'
      );
    } else if (this.reform?.allValidationErrors().length) {
      this.reform.revealAllErrors();
      this.overlay.alert('Lütfen gerekli alanları doldurunuz.', '', 'error');
    } else if (this.reform) {
      this.passwordResetService
        .resetPw(this.id, this.reform.value.password)
        .subscribe({
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
