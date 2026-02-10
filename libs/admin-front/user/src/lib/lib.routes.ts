import { Route } from '@angular/router';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { rolesGuard } from '@lotus/front-global/ng-auth-guards';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const rota: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: UsersPageComponent,
    // canActivate: [rolesGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    pathMatch: 'full',
    path: 'new',
    component: UserDetailsComponent,
    // canActivate: [rolesGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    pathMatch: 'full',
    path: ':id',
    component: UserDetailsComponent,
    // canActivate: [rolesGuard],
    // data: { roles: ['ADMIN'] },
  },
];
