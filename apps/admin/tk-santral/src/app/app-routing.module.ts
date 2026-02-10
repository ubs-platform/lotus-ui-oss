import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NotFoundPageComponent,
  SuspendedPageComponent,
} from '@lotus/front-global/error-status-pages';
import {
  FlexyPageContainerComponent,
  PageContainerComponent,
} from '@lotus/front-global/ui/page-container';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/users',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    data: {
      rulerWidth: '1920px',
    },
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/admin-front/lotus-adm-parent').then((m) => m.AdminFrontLotusParentModule),
  },

  {
    component: PageContainerComponent,

    path: 'account',
    loadChildren: () =>
      import('@lotus/front-global/account-setting-pages').then(
        (m) => m.FrontGlobalAccountSettingPagesModule
      ),
  },
  {
    component: PageContainerComponent,
    path: 'suspended',
    children: [
      {
        component: SuspendedPageComponent,
        path: '',
      },
    ],
  },
  {
    component: PageContainerComponent,
    path: '**',
    children: [
      {
        component: NotFoundPageComponent,
        path: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
