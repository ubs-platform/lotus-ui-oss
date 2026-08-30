import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { AccountsComponent } from "./components/accounts/accounts.component";
import { AdminFrameComponent } from './components/admin-frame/admin-frame.component';
import { HomepageComponent } from './components/home-page/homepage.component';
import { ExternalPlatformListComponent } from './components/external-platform-list/external-platform-list.component';
import {
  NotFoundPageComponent,
  SuspendedPageComponent,
} from '@lotus/front-global/error-status-pages';
import {
  AccountsComponent,
  AccountUserInfoComponent,
  AddressListComponent,
} from '@lotus/postral-core-frontend/account-user-edit';
import { ItemListComponent } from 'libs/postral-core-frontend/account-user-edit/src/lib/components/item-list/item-list.component';
import { ItemInfoComponent } from 'libs/postral-core-frontend/account-user-edit/src/lib/components/item-info/item-info.component';
import { AddressInfoComponent } from 'libs/postral-core-frontend/account-user-edit/src/lib/components/address-info/address-info.component';
import { ComissionListComponent } from './components/comission-list/comission-list.component';
import { ComissionEditComponent } from './components/comission-edit/comission-edit.component';
import { AdminSettingsEditComponent } from './components/admin-settings-edit/admin-settings-edit.component';
import { AdminOperationsComponent } from './components/admin-operations/admin-operations.component';
import { QueryInfoComponent, QueryListComponent, ReportInfoComponent, ReportListComponent } from '@lotus/postral-core-frontend/reports';
import { PaymentChannelConfigListComponent } from './components/payment-channel-config-list/payment-channel-config-list.component';
import { PaymentChannelConfigEditComponent } from './components/payment-channel-config-edit/payment-channel-config-edit.component';
import { ExternalPlatformEditComponent } from './components/external-platform-edit/external-platform-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminFrameComponent,
        children: [
          { path: '', component: HomepageComponent },
          { path: 'comission', component: ComissionListComponent },
          { path: 'comission/create', component: ComissionEditComponent },
          { path: 'comission/:id', component: ComissionEditComponent },
          { path: 'admin-settings', component: AdminSettingsEditComponent },
          { path: "admin-operations", component: AdminOperationsComponent },
          { path: "payment-channel-config", component: PaymentChannelConfigListComponent },
          { path: "payment-channel-config/create", component: PaymentChannelConfigEditComponent },
          { path: "payment-channel-config/:id", component: PaymentChannelConfigEditComponent },
          { path: "report-query", component: QueryListComponent, data: { admin: true } },
          { path: "report-query/:id", component: QueryInfoComponent },
          { path: "report-query/:queryId/reports", component: ReportListComponent, data: { admin: true } },
          { path: "reports", component: ReportListComponent, data: { admin: true } },
          { path: "external-platforms", component: ExternalPlatformListComponent, data: { admin: true } },
          { path: "external-platforms/create", component: ExternalPlatformEditComponent, data: { admin: true } },
          { path: "external-platforms/:id", component: ExternalPlatformEditComponent, data: { admin: true } },
          { path: "reports/:id", component: ReportInfoComponent },
          {
            path: 'users',
            loadChildren: () =>
              import('@lotus/admin-front/user').then((a) => a.AdminFrontUserModule),
          },
          // {
          //   path: 'comments',
          //   data: { adminMode: true, headerless: true },
          //   loadChildren: () =>
          //     import('@lotus/lotus-frontend/book-comments').then(
          //       (a) => a.BookCommentsModule
          //     ),
          // },
          {
            path: 'publisher-teams',
            loadChildren: () =>
              import('@lotus/front-global/publisher-teams/pages').then(
                (m) => m.PagesModule
              ),
            data: { admin: true, showLotusTrustTeam: false },
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
            component: NotFoundPageComponent,
            path: '**',
          },
        ],
      },
    ]),
  ],
})
export class AdminRoutesModule { }
