import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuth, UserAuthStatus, UserDTO } from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import {
  map,
  Observable,
  of,
  onErrorResumeNext,
  onErrorResumeNextWith,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly RESOURCE_URL = `${environment.authUrl}auth`;
  constructor(private http: HttpClient) {}

  hasRole(...roleName: string[]): Observable<boolean> {
    return this.http
      .post(`${this.RESOURCE_URL}/has-role`, roleName)
      .pipe(map((a) => a as boolean));
  }

  authenticate(info: UserAuth): Observable<UserAuthStatus> {
    return this.http
      .post(`${this.RESOURCE_URL}`, info)
      .pipe(map((a) => a as UserAuthStatus));
  }

  /**
   * Finds a user related with jwt token in header in this pattern `Authorization: bearer (token)`
   * @returns
   */
  findCurrentUser() {
    return this.http.get(`${this.RESOURCE_URL}`).pipe(map((a) => a as UserDTO));
  }

  /**
   * Finds a user related with jwt token in header in this pattern `Authorization: bearer (token)`
   * @returns
   */
  logout() {
    return this.http.post(`${this.RESOURCE_URL}/logout`, null).pipe();
  }
}
