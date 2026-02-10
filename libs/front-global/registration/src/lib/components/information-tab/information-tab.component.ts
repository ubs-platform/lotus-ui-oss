import { Component, OnInit } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import {
  RegistrationForm,
  UserRegisterService,
  UserService,
} from '@lotus/front-global/auth';
import { UserDTO, UserRegisterDTO } from '@ubs-platform/users-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Router } from '@angular/router';

@Component({
  selector: 'lotus-web-information-tab',
  templateUrl: './information-tab.component.html',
  styleUrls: ['./information-tab.component.scss'],
  standalone: false,
})
export class InformationTabComponent implements OnInit {
  reform?: Reform<RegistrationForm>;
  constructor(
    private usrsrvc: UserService,
    private userRegisterService: UserRegisterService,
    private overlay: BasicOverlayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRegisterService.startRegistration().subscribe((a) => {
      this.reform = new Reform(RegistrationForm, a as any);
    });
  }

  sendRequest() {
    const val = this.reform!.value;
    if (val.password != val.passwordRepeat) {
      this.reform?.revealAllErrors();

      this.overlay.alert(
        'Üyelik tamamlanamadı',
        'Parolanız uyuşmuyor.',
        'error'
      );
    } else if (this.reform?.allValidationErrors().length) {
      this.reform.revealAllErrors();
      this.overlay.alert(
        'Üyelik tamamlanamadı',
        'Lütfen gerekli alanları doldurunuz.',
        'error'
      );
    } else {
      val.passwordRepeat = '';
      this.userRegisterService.register(val).subscribe({
        next: () => {
          this.router.navigate(['registration', 'completion']);
        },
        error: (err) => {
          this.overlay.alert('Üyelik tamamlanamadı', err.error, 'error');
        },
      });
    }
  }
}
