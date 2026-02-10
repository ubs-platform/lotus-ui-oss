import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { key } from '@milkdown/plugin-listener';
import {
  UserAuth,
  UserAuthStatus,
  UserDTO,
  UserGeneralInfoDTO,
  UserRegisterDTO,
} from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRegisterService {
  readonly RESOURCE_URL = `${environment.authUrl}user-registration`;
  constructor(private http: HttpClient) {}

  /**
   * Finds a user related with jwt token in header in this pattern `Authorization: bearer (token)`
   * @returns
   */
  startRegistration() {
    const registrationId = this.defaultRegisterId();
    const qp = registrationId ? `?registration-id=${registrationId}` : '';
    return this.http
      .post(`${this.RESOURCE_URL}/init${qp}`, null)
      .pipe(map((a_) => this.setIdAndReturn(a_)));
  }

  private setIdAndReturn(a_: Object) {
    let a = a_ as any as UserRegisterDTO;
    localStorage.setItem('registerId', a.registerId);
    return a;
  }

  activate(activationKey: any) {
    return this.http
      .post(`${this.RESOURCE_URL}/activate/${activationKey}`, null)
      .pipe();
  }

  private defaultRegisterId() {
    return localStorage.getItem('registerId');
  }

  /**
   * Finds a user related with jwt token in header in this pattern `Authorization: bearer (token)`
   * @returns
   */
  register(registration: any) {
    return this.http.post(`${this.RESOURCE_URL}`, registration).pipe();
  }
}
