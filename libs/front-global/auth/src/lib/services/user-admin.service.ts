import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UserAuthBackendDTO,
  UserDTO,
  UserFullDto,
} from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import { Observable, map } from 'rxjs';

@Injectable()
export class UserAdminService {
  readonly RESOURCE_URL = `${environment.authUrl}_adm_/user`;

  constructor(public http: HttpClient) {}

  public listAllUsers(): Observable<UserAuthBackendDTO[]> {
    return this.http
      .get(`${this.RESOURCE_URL}`)
      .pipe(map((a) => a as UserAuthBackendDTO[]));
  }

  public fetchOne(id: any): Observable<UserFullDto> {
    return this.http
      .get(`${this.RESOURCE_URL}/${id}`)
      .pipe(map((a) => a as UserFullDto));
  }

  public editOne(user: UserFullDto): Observable<UserFullDto> {
    return this.http
      .put(`${this.RESOURCE_URL}`, user)
      .pipe(map((a) => a as UserFullDto));
  }

  addUser(value: UserFullDto | undefined) {
    return this.http
      .post(`${this.RESOURCE_URL}`, value)
      .pipe(map((a) => a as UserFullDto));
  }

  public insertOne(user: UserFullDto): Observable<UserFullDto> {
    return this.http
      .post(`${this.RESOURCE_URL}`, user)
      .pipe(map((a) => a as UserFullDto));
  }

  public delete(id: any): Observable<UserFullDto> {
    return this.http
      .delete(`${this.RESOURCE_URL}/${id}`)
      .pipe(map((a) => a as UserFullDto));
  }
}
