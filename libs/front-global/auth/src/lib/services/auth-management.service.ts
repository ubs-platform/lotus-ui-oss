import { Injectable, OnInit } from '@angular/core';
import { UserAuth, UserAuthStatus, UserDTO } from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import {
  map,
  Observable,
  catchError,
  throwError,
  ReplaySubject,
  switchMap,
  of,
} from 'rxjs';
import { TokenGetter, TOKEN_FIELD } from '../common/token-getter';
import { bearerTokenInterceptorGetReady } from '../interceptors/bearer-token-ready';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { onlineStatus } from '@lotus/front-global/mona-mobile-experience-ng';

@Injectable({
  providedIn: 'root',
})
export class AuthManagementService {
  readonly RESOURCE_URL = environment.authUrl;
  private readonly _user = new ReplaySubject<UserDTO | null | undefined>(
    1,
    Infinity
  );
  firstRun = false;
  constructor(
    private authService: AuthService,
    private tokenGetter: TokenGetter,
    private router: Router
  ) {}

  hasRole(...role: string[]) {
    if (!this._user) {
      return of(false);
    } else {
      return this.authService.hasRole(...role);
    }
  }

  login(a: UserAuth) {
    return this.authService.authenticate(a).pipe(
      switchMap((b) => {
        this.saveToken(b.token!);
        return this.checkUser();
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_FIELD, token);
  }

  getToken() {
    return this.tokenGetter.getToken();
  }

  checkUser(): Observable<UserDTO | null> {
    let action = this.authService.findCurrentUser();
    if (!this.getToken()) {
      action = throwError(() => 'Token is not available');
    }
    return action.pipe(
      catchError((a) => {
        console.error(a);
        this._user.next(null);

        this.removeToken();
        return throwError(() => a);
      }),
      map((a) => {
        if (a.suspended) {
          this.router.navigate(['suspended'], {
            skipLocationChange: true,
            state: { reason: a.suspendReason },
          });
          this.removeToken();
        } else {
          this._user.next(a);
        }
        //

        return a;
      })
    );
  }

  userChange() {
    this.initialize();
    return onlineStatus.pipe((a) => (a ? this._user.asObservable() : of(null)));
  }

  private initialize() {
    if (!this.firstRun) {
      this.checkUser().subscribe();
      this.firstRun = true;
    }
  }

  removeToken() {
    localStorage.removeItem(TOKEN_FIELD);
  }

  logout() {
    return this.authService.logout().pipe(
      map(() => {
        // location.reload();
        this.removeToken();
        this._user.next(null);
        return true;
      })
    );
  }
}
