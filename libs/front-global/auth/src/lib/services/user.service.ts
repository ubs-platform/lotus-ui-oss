import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO, UserGeneralInfoDTO } from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly RESOURCE_URL = `${environment.authUrl}user`;
  constructor(private http: HttpClient) {}

  /**
   * Finds a user related with jwt token in header in this pattern `Authorization: bearer (token)`
   * @returns
   */
  register(registration: any) {
    return this.http.post(`${this.RESOURCE_URL}`, registration).pipe();
  }

  editGeneralInformation(data: UserGeneralInfoDTO) {
    return this.http
      .put(`${this.RESOURCE_URL}/current/general`, data)
      .pipe(map((a) => a as UserGeneralInfoDTO));
  }

  fetchGeneralInformation(): Observable<UserGeneralInfoDTO> {
    return this.http
      .get(`${this.RESOURCE_URL}/current/general`)
      .pipe(map((a) => a as UserGeneralInfoDTO));
  }

  setNewEmailRequest(email: string): Observable<{ approveId: string }> {
    return this.http
      .put(`${this.RESOURCE_URL}/current/email`, { email })
      .pipe(map((a) => a as { approveId: string }));
  }

  approveNewEmailRequest(id: string, code: string): Observable<UserDTO> {
    return this.http
      .post(`${this.RESOURCE_URL}/current/email/${id}`, { code })
      .pipe(map((a) => a as UserDTO));
  }

  changePassword(value: {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
  }) {
    return this.http
      .put(`${this.RESOURCE_URL}/current/password`, value)
      .pipe(map((a) => a as UserDTO));
  }
}
