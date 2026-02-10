import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@lotus-web/environment';
import { map, of } from 'rxjs';
import { AuthService, RoleService } from '@lotus/front-global/auth';
import { inject } from '@angular/core';
export const rolesGuard: CanActivateFn = (route, state) => {
  const roleList = route.data?.['roles'] as string[];
  if (roleList) {
    const roleService: RoleService = inject(RoleService);
    const router: Router = inject(Router);
    const isOk = roleService.hasRole(roleList).pipe(
      map((a) => {
        if (!a) {
          router.navigateByUrl('not-allowed', { skipLocationChange: true });
        }
        return a;
      })
    );

    return isOk;
  } else {
    return of(true);
  }
};
