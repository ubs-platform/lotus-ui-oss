import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GlobalVariableDTO,
  GlobalVariableWriteDTO,
} from '@ubs-platform/notify-common';
import { UserDTO } from '@ubs-platform/users-common';
import { environment } from '@lotus-web/environment';
import { Observable, map } from 'rxjs';

@Injectable()
export class GlobalVariableService {
  readonly RESOURCE_URL = `${environment.notifyUrl}/global-variable`;

  constructor(public http: HttpClient) {}

  public list(): Observable<GlobalVariableDTO[]> {
    return this.http
      .get(`${this.RESOURCE_URL}`)
      .pipe(map((a) => a as GlobalVariableDTO[]));
  }

  public edit(gwrite: GlobalVariableWriteDTO): Observable<GlobalVariableDTO> {
    return this.http
      .put(`${this.RESOURCE_URL}`, gwrite)
      .pipe(map((a) => a as GlobalVariableDTO));
  }

  public rename(id: string, newName: string): Observable<GlobalVariableDTO> {
    return this.http
      .put(`${this.RESOURCE_URL}/rename`, { _id: id, name: newName })
      .pipe(map((a) => a as GlobalVariableDTO));
  }

  public dublicate(id: string): Observable<GlobalVariableDTO> {
    return this.http
      .put(`${this.RESOURCE_URL}/dublicate`, { id })
      .pipe(map((a) => a as GlobalVariableDTO));
  }

  // public fetchOne(id: any): Observable<UserFullDto> {
  //   return this.http
  //     .get(`${this.RESOURCE_URL}/${id}`)
  //     .pipe(map((a) => a as UserFullDto));
  // }

  // public editOne(user: UserFullDto): Observable<UserFullDto> {
  //   return this.http
  //     .put(`${this.RESOURCE_URL}`, user)
  //     .pipe(map((a) => a as UserFullDto));
  // }

  // addUser(value: UserFullDto | undefined) {
  //   return this.http
  //     .post(`${this.RESOURCE_URL}`, value)
  //     .pipe(map((a) => a as UserFullDto));
  // }

  // public insertOne(user: UserFullDto): Observable<UserFullDto> {
  //   return this.http
  //     .post(`${this.RESOURCE_URL}`, user)
  //     .pipe(map((a) => a as UserFullDto));
  // }

  // public delete(id: any): Observable<UserFullDto> {
  //   return this.http
  //     .delete(`${this.RESOURCE_URL}/${id}`)
  //     .pipe(map((a) => a as UserFullDto));
  // }
}
