import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/home-page/homepage.component';
// import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminFrameComponent } from './components/admin-frame/admin-frame.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { RouterModule } from '@angular/router';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { AdminRoutesModule } from './admin-routes.module';
import { UbsTouchNgxModule } from '@lotus/front-global/ubs-touch-ngx';
import { AccordionComponent } from '@lotus/legendary-front/accordion';
import { AccountUserEditModule } from "@lotus/postral-core-frontend/account-user-edit";
import { ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { ComissionListComponent } from './components/comission-list/comission-list.component';
import { ComissionEditComponent } from './components/comission-edit/comission-edit.component';
import { DataListLayoutModule } from "@lotus/front-global/ui/data-list-layout";
import { AdminSettingsEditComponent } from './components/admin-settings-edit/admin-settings-edit.component';
import { AdminOperationsComponent } from './components/admin-operations/admin-operations.component';
import { PaymentChannelConfigListComponent } from './components/payment-channel-config-list/payment-channel-config-list.component';
import { PaymentChannelConfigEditComponent } from './components/payment-channel-config-edit/payment-channel-config-edit.component';
import { ExternalPlatformListComponent } from './components/external-platform-list/external-platform-list.component';
import { ExternalPlatformEditComponent } from './components/external-platform-edit/external-platform-edit.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
// import { AccountsComponent } from "@lotus/postral-core-frontend/account-user-edit"

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    RouterModule,
    FrontGlobalSidebarModule,
    AdminRoutesModule,
    UbsTouchNgxModule,
    AccordionComponent,
    AccountUserEditModule,
    ReformDataEditComponent,
    DataListLayoutModule,
    UbsTranslatorNgxModule
  ],
  declarations: [HomepageComponent, AdminFrameComponent, ComissionListComponent, ComissionEditComponent, AdminSettingsEditComponent, AdminOperationsComponent, PaymentChannelConfigListComponent, PaymentChannelConfigEditComponent,
    ExternalPlatformListComponent, ExternalPlatformEditComponent

  ],
  exports: [HomepageComponent, AdminFrameComponent],
})
export class PostralCoreAdminModule { }
