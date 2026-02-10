import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserAuth } from '@ubs-platform/users-common';
import { AuthManagementService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  minky,
  minkyRoot,
  Reform,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  LoadingIndicationService,
  LoadingIndicatorState,
} from '@lotus/front-global/user-service-wraps';
import { Observable, of } from 'rxjs';

@minkyRoot({
  fallbackConstruction: () => new LoginObject(),
})
class LoginObject implements UserAuth {
  @minky({
    validators: [new RequiredValidator()],
    label: 'mona.username',
  })
  login!: string;
  @minky({
    validators: [new RequiredValidator()],
    inputType: 'password',
    label: 'mona.password',
  })
  password!: string;

  @minky({
    validators: [],
    inputType: 'checkbox',
    label: 'mona.remember-me',
    defaultValueConstructor: () => true,
  })
  check?: boolean;
}

@Component({
  selector: 'lotus-web-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: false,
})
export class LoginDialogComponent implements OnInit {
  reform?: Reform<any>;
  @Output() loginSuccess = new EventEmitter<boolean>();
  loading: Observable<LoadingIndicatorState>;
  constructor(
    private dialogRef: DynamicDialogRef,
    private authManager: AuthManagementService,
    private basicOverlay: BasicOverlayService,
    private loadingIndicationService: LoadingIndicationService
  ) {
    this.reform = new Reform(LoginObject);
    // this.loading = of({
    //   show: true,
    //   group: '',
    //   progressValue: 0,
    // });
    this.loading = loadingIndicationService.getObservable();
  }

  ngOnInit(): void {}

  submit() {
    if (this.reform?.allValidationErrors().length) {
      this.basicOverlay.alert(
        'mona.unable-to-login',
        'mona.required-fields',
        'error'
      );
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Giriş yapılamıyor',
      //   detail: 'Lütfen gerekli alanları doldurun',
      // });
      this.reform.revealAllErrors();
    } else {
      this.authManager.login(this.reform?.value).subscribe({
        next: (u) => {
          this.basicOverlay.alert('mona.login-success', '', 'success');
          this.loginSuccess.emit(true);
          this.dialogRef?.close();
        },
        error: (e) => {
          this.basicOverlay.alert(
            'mona.unable-to-login',
            `users.errors.${e.error.key}`,
            'error'
          );
        },
      });
    }
  }
}
