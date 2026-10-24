import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthManagementService } from '@lotus/front-global/auth';

/** Redirects to `/login` when there is no token or the current user cannot be resolved. */
export const loggedInGuard: CanActivateFn = () => {
  const authManagement = inject(AuthManagementService);
  const loginUrl = inject(Router).createUrlTree(['/login'],{
    queryParams: {
      redirectTo: window.location.pathname
    }
  });
  return authManagement.checkUser().pipe(
    map((user) => (user ? true : loginUrl)),
    catchError(() => of(loginUrl)),
  );
};
