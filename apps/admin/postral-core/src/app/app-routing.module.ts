import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedInGuard } from '@lotus/front-global/ng-auth-guards';
import { platformSetupEntryGuard } from '@lotus/postral-core-frontend/admin/setup-guards';
import { NotFoundPageComponent } from '@lotus/front-global/error-status-pages';
import {
  FlexyPageContainerComponent,
  FlexyPageNoRulerContainerComponent,
  PageContainerComponent,
} from '@lotus/front-global/ui/page-container';
import { EntityCapabilityGroupConfig } from 'libs/front-global/publisher-teams/pages/src/lib/team-members/entity-capability-group-config';
import { HeaderlessDwhPageContainerComponent } from 'libs/front-global/ui/page-container/src/lib/component/headerless-dwh-page-container/headerless-dwh-page-container.component';
import {
  ENTITY_GROUP_LOTUS,
  ENTITY_GROUP_POSTRAL,
  ENTITY_NAME_POSTRAL_ACCOUNT,
  ENTITY_NAME_POSTRAL_ADDRESS,
  ENTITY_NAME_POSTRAL_TAX,
  ENTITY_NAME_QUESTION_BOOK,
  LotusCapability,
} from 'libs/lotus-common/consts/src/lib/consts';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [loggedInGuard, platformSetupEntryGuard],
    component: FlexyPageNoRulerContainerComponent,
    loadChildren: () =>
      import('@lotus/postral-core-frontend/admin').then(
        (m) => m.PostralCoreAdminModule,
      ),
  },
  {
    path: 'user/payment-accounts',
    canActivate: [loggedInGuard, platformSetupEntryGuard],
    component: FlexyPageContainerComponent,
    data: { paymentMode: 'seller' },
    loadChildren: () =>
      import('@lotus/postral-core-frontend/account-user-edit').then(
        (m) => m.AccountUserEditModule,
      ),
  },
  {
    path: 'password-reset',
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/password-reset').then(
        (m) => m.FrontGlobalPasswordResetModule,
      ),
  },
  {
    path: 'account',
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/account-setting-pages').then(
        (m) => m.FrontGlobalAccountSettingPagesModule,
      ),
  },
  {
    path: 'sale-simulation',
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/postral-core-frontend/sale-simulation').then(
        (m) => m.SaleSimulationModule,
      ),
  },

  {
    path: 'publisher',
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/publisher-request').then(
        (m) => m.LotusFrontendPublisherRequestModule,
      ),
  },
  {
    path: 'publisher-teams',
    canActivate: [loggedInGuard],
    component: FlexyPageContainerComponent,
    loadChildren: () =>
      import('@lotus/front-global/publisher-teams/pages').then(
        (m) => m.PagesModule,
      ),
    data: {
      entityCapabilityGroups: [
        {
          entityGroup: ENTITY_GROUP_POSTRAL,
          entityName: ENTITY_NAME_POSTRAL_ADDRESS,
          label: 'Postral Adres yönetimi',
        },
        {
          entityGroup: ENTITY_GROUP_POSTRAL,
          entityName: ENTITY_NAME_POSTRAL_ACCOUNT,
          label: 'Postral Ödeme Hesabı yönetimi',
        },
        {
          entityGroup: ENTITY_GROUP_POSTRAL,
          entityName: ENTITY_NAME_POSTRAL_TAX,
          label: 'Postral Vergi yönetimi',
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
    path: 'login',
    component: FlexyPageContainerComponent,
    data: {
      customBackground: "url('/assets/background.png')",
    },
    loadChildren: () =>
      import('@lotus/front-global/login-pages').then(
        (m) => m.FrontGlobalLoginPagesModule,
      ),
  },
  {
    component: FlexyPageContainerComponent,
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
export class AppRoutingModule {}
