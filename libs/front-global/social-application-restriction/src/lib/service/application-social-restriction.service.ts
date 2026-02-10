import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApplicationSocialRestrictionSearchDTO } from '../dto/application-social-restriction.dto';

@Injectable()
export class ApplicationSocialRestrictionService {
  readonly prefix = '/api/social/application-social-restriction';
  constructor(private httpCl: HttpClient) {}

  checkUserRestriction(
    u: ApplicationSocialRestrictionSearchDTO
  ): Observable<boolean> {
    return this.httpCl
      .get(`${this.prefix}/${u.userId}/${u.restriction}`)
      .pipe(map((a) => a as boolean));
  }
}
