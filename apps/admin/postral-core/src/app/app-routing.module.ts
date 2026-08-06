import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from '@lotus/front-global/error-status-pages';
import {
  FlexyPageContainerComponent,
  PageContainerComponent,
} from '@lotus/front-global/ui/page-container';
import { EntityCapabilityGroupConfig } from 'libs/front-global/publisher-teams/pages/src/lib/team-members/entity-capability-group-config';
import { ENTITY_GROUP_LOTUS, ENTITY_GROUP_POSTRAL, ENTITY_NAME_POSTRAL_ACCOUNT, ENTITY_NAME_POSTRAL_ADDRESS, ENTITY_NAME_QUESTION_BOOK, LotusCapability } from 'libs/lotus-common/consts/src/lib/consts';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@lotus/postral-core-frontend/admin').then(
        (m) => m.PostralCoreAdminModule
      ),
  },
  {
    path: 'user/payment-accounts',
    data: { paymentMode: 'seller' },
    loadChildren: () =>
      import('@lotus/postral-core-frontend/account-user-edit').then(
        (m) => m.AccountUserEditModule
      ),
  },
  {
    path: 'password-reset',
    loadChildren: () =>
      import('@lotus/front-global/password-reset').then(
        (m) => m.FrontGlobalPasswordResetModule
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('@lotus/front-global/account-setting-pages').then(
        (m) => m.FrontGlobalAccountSettingPagesModule
      ),
  },
  {
    path: 'sale-simulation',
    loadChildren: () =>
      import('@lotus/postral-core-frontend/sale-simulation').then(
        (m) => m.SaleSimulationModule
      ),
  },

  {
    path: 'publisher',
    component: PageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/publisher-request').then(
        (m) => m.LotusFrontendPublisherRequestModule
      ),
  },
  {
    path: 'publisher-teams',
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/publisher-teams/pages').then(
        (m) => m.PagesModule
      ), data: {
        entityCapabilityGroups: [
          {
            entityGroup: ENTITY_GROUP_POSTRAL,
            entityName: ENTITY_NAME_POSTRAL_ACCOUNT,
            label: 'Hesap yönetimi yetkisi',
          },
          {
            entityGroup: ENTITY_GROUP_POSTRAL,
            entityName: ENTITY_NAME_POSTRAL_ADDRESS,
            label: 'Adres yönetimi yetkisi',
          },
        ] satisfies EntityCapabilityGroupConfig[],
      },
  },
  // {
  //   component: FlexyPageContainerComponent,
  //   path: 'creator/comments',
  //   data: {
  //     rulerWidth: '1920px',
  //   },
  //   loadChildren: () =>
  //     import('@lotus/lotus-frontend/book-comments').then((a) => a.BookCommentsModule),
  // },
  // {
  //   component: PageContainerComponent,
  //   path: 'suspended',
  //   children: [
  //     {
  //       component: SuspendedPageComponent,
  //       path: '',
  //     },
  //   ],
  // },
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
