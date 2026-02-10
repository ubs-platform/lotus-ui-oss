import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UserAuth,
  UserAuthStatus,
  UserDTO,
  UserGeneralInfoDTO,
} from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import { PasswordChangeForm } from 'libs/front-global/account-setting-pages/src/lib/forms/password-change.form';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  readonly RESOURCE_URL = `${environment.authUrl}reset-password/`;
  constructor(private http: HttpClient) {}

  init(username: string) {
    return this.http.post(this.RESOURCE_URL, { username }).pipe();
  }

  has(id: string) {
    return this.http
      .get(`${this.RESOURCE_URL}${id}`)
      .pipe(map((a) => a as boolean));
  }

  resetPw(id: string, newPassword: string) {
    return this.http.post(`${this.RESOURCE_URL}${id}`, { newPassword }).pipe();
  }
}
