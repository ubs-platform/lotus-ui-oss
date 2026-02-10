import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ApplicationSocialRestrictionAddDTO,
  ApplicationSocialRestrictionDTO,
  ApplicationSocialRestrictionSearchDTO,
} from '../dto/application-social-restriction.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationSocialRestrictionAdminService {
  readonly prefix = '/api/social/application-social-restriction/admin';
  constructor(private httpCl: HttpClient) {}

  userRestrictionDetail(
    u: ApplicationSocialRestrictionSearchDTO
  ): Observable<ApplicationSocialRestrictionDTO> {
    return this.httpCl
      .get(`${this.prefix}/${u.userId}/${u.restriction}`)
      .pipe(map((a) => a as ApplicationSocialRestrictionDTO));
  }

  addUserRestriction(
    u: ApplicationSocialRestrictionAddDTO
  ): Observable<ApplicationSocialRestrictionDTO> {
    return this.httpCl
      .post(`${this.prefix}`, u)
      .pipe(map((a) => a as ApplicationSocialRestrictionDTO));
  }

  deleteUserRestriction(
    u: ApplicationSocialRestrictionSearchDTO
  ): Observable<any> {
    return this.httpCl
      .delete(`${this.prefix}/${u.userId}/${u.restriction}`)
      .pipe();
  }
}
