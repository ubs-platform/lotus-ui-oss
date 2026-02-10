import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthManagementService,
  AuthService,
  UserRegisterService,
  UserService,
} from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { UserDTO } from '@ubs-platform/users-common';
import { Observable } from 'rxjs';

@Component({
  selector: 'lotus-web-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: false,
})
export class LoginPageComponent {
  redirectTo: string = '/';
  showWarning: boolean = false;
  activated: boolean = false;
  currentUser?: Observable<UserDTO | null | undefined>;
  constructor(
    private activeROute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private authService: AuthManagementService,
    private secondOverlay: BasicOverlayService,
    private userRegisterService: UserRegisterService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.userChange();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activeROute.queryParams.subscribe((qp) => {
      const activationKey = qp['activationKey'],
        redirectTo = qp['redirectTo'],
        showWarning = qp['showWarning'];
      this.redirectTo = redirectTo || '/';
      this.showWarning = showWarning && showWarning != 'false';
      if (activationKey) {
        this.userRegisterService.activate(activationKey).subscribe(() => {
          this.activated = true;
        });
      }
    });
  }

  logout() {
    this.secondOverlay
      .confirm('mona.logout', 'mona.sure-logout')
      .subscribe((status) => {
        if (status) {
          this.authService.logout().subscribe();
        }
      });
  }

  successLogin() {
    this.router.navigateByUrl(this.redirectTo || '/');
  }
}
