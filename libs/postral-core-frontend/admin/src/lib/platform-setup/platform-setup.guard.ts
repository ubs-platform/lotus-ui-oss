import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@lotus/front-global/auth/service';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { catchError, map, of, switchMap } from 'rxjs';
import { PlatformSetupClientService } from '@lotus/postral-core-frontend/client/platform-setup';

export const PLATFORM_ADMIN_ROLES = ['ADMIN', 'POSTRAL-ADMIN', 'POSTRAL_ADMIN'];

export const platformSetupEntryGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const client = inject(PlatformSetupClientService);
  const router = inject(Router);
  const overlay = inject(BasicOverlayService);
  if (state.url.split('?')[0] === '/admin/setup') return true;
  return auth.hasRole(...PLATFORM_ADMIN_ROLES).pipe(
    switchMap((admin) =>
      admin
        ? client
            .status()
            .pipe(
              map((status) =>
                status.status === 'COMPLETED'
                  ? true
                  : router.parseUrl('/admin/setup'),
              ),
            )
        : of(true),
    ),
    catchError(() => {
      overlay.alert(
        'general.error',
        'postral.platform-setup.load-error',
        'error',
      );
      return of(router.parseUrl('/admin/setup'));
    }),
  );
};

export const platformSetupAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const overlay = inject(BasicOverlayService);
  return auth.hasRole(...PLATFORM_ADMIN_ROLES).pipe(
    map((admin) => (admin ? true : router.parseUrl('/admin'))),
    catchError(() => {
      overlay.alert(
        'general.error',
        'postral.platform-setup.load-error',
        'error',
      );
      return of(false);
    }),
  );
};
