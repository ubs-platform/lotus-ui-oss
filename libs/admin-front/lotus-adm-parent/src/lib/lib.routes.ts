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
      {
        path: 'comments',
        data: {
          adminMode: true,
          headerless: true,

        },
        loadChildren: () =>
          import('@lotus/lotus-frontend/book-comments').then(
            (a) => a.BookCommentsModule
          ),
      },
      {
        path: 'publisher-teams',
        loadChildren: () =>
          import('@lotus/front-global/publisher-teams/pages').then(
            (m) => m.PagesModule
          ),
      },
    ],
  },
];
