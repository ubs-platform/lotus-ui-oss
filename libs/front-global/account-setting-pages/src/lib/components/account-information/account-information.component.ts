import { Component, OnInit } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { UserGeneralForm } from '../../forms/user-information.form';
import {
  AuthManagementService,
  AuthService,
  UserService,
} from '@lotus/front-global/auth';
import { UserGeneralInfoDTO } from '@ubs-platform/users-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

import { PredefinedDataManager } from '@lotus/front-global/predefined-data';
import { Router } from '@angular/router';
import { LanguageManagement } from '@lotus/front-global/language-management';
@Component({
    selector: 'lotus-web-account-information',
    templateUrl: './account-information.component.html',
    styleUrls: ['./account-information.component.scss'],
    standalone: false
})
export class AccountInformationComponent implements OnInit {
  reform!: Reform<UserGeneralInfoDTO>;
  constructor(
    private authManagementService: AuthManagementService,
    private userService: UserService,
    private overlay: BasicOverlayService,
    private predefinedDataManager: PredefinedDataManager,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.fetchGeneralInformation().subscribe(
      (a) => {
        if (a) {
          this.reform = new Reform(UserGeneralForm, a);
          // LanguageManagement.registerLanguageFeeder(this.reform);
          // this.predefinedDataManager.register(this.reform);
        } else {
          this.navigateToLogin();
        }
      },
      () => {
        this.navigateToLogin();
      },
      () => {}
    );
  }

  navigateToLogin() {
    this.router.navigate(['login'], {
      queryParams: {
        showWarning: true,
        redirectTo: encodeURI(location.pathname),
      },
    });
  }

  sendRequest() {
    const val = this.reform!.value;
    if (this.reform?.allValidationErrors().length) {
      this.reform.revealAllErrors();
      this.overlay.alert(
        'Bilgiler kaydedilemiyor',
        'Lütfen gerekli alanları doldurunuz.',
        'error'
      );
    } else {
      this.userService.editGeneralInformation(val).subscribe({
        next: () => {
          this.authManagementService.checkUser();
          this.overlay.alert('Bilgiler kaydedildi', '', 'success');
        },
        error: (err) => {
          this.overlay.alert('Bilgiler kaydedilemiyor', err.error, 'error');
        },
      });
    }
  }
}
