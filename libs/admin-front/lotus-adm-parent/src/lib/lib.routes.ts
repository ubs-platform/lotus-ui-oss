import { Route } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const frontGlobalAdminLotusRoutes: Route[] = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('@lotus/admin-front/user').then((a) => a.AdminFrontUserModule),
      },
      {
        path: 'notify',
        loadChildren: () =>
          import('@lotus/admin-front/notify').then(
            (a) => a.AdminFrontNotifyModule
          ),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('@lotus/admin-front/feedback-admin').then(
            (a) => a.AdminFrontFeedbackModule
          ),
      },
    ],
  },
];
