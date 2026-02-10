import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@lotus-web/environment';
import { catchError, map, of, onErrorResumeNextWith } from 'rxjs';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient) {}

  hasRole(roleList: string[]) {
    if (!roleList || roleList.length == 0) return of(true);

    return this.http.post(`${environment.authUrl}auth/has-role`, roleList).pipe(
      map((a) => a as any as boolean),
      catchError(() => of(false))
    );
  }
}
