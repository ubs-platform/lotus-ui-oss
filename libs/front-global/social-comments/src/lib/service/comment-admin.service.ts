import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { UserDTO } from '@ubs-platform/users-common';

@Injectable()
export class CommentAdminService {
  readonly prefix = '/api/social/comment/admin';
  constructor(private httpCl: HttpClient) {}


  clearCommentsOfUser(userId: string): Observable<any> {
    return this.httpCl.delete(`${this.prefix}/user-id/${userId}`).pipe();
  }

}
