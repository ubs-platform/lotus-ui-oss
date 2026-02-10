import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, of } from 'rxjs';
import { RoleService } from '@lotus/front-global/auth';
import { inject } from '@angular/core';
export const MobileExternalPageChange: CanActivateFn = (route, state) => {
  const nextUrl = state.url;
  const router: Router = inject(Router);
  return new UrlTree();
  // return false; // Manuel yönlendirme yaptığımız için false dönüyoruz
  // const roleList = route.data?.['roles'] as string[];
  // if (roleList) {
  //   const roleService: RoleService = inject(RoleService);
  //   const router: Router = inject(Router);
  //   const isOk = roleService.hasRole(roleList).pipe(
  //     map((a) => {
  //       if (!a) {
  //         router.navigateByUrl('not-allowed', { skipLocationChange: true });
  //       }
  //       return a;
  //     })
  //   );

  //   return isOk;
  // } else {
  //   return of(true);
  // }
};
