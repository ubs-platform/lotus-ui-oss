import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { frontGlobalAccountSettingPagesRoutes } from './lib.routes';
import { MainViewComponent } from './components/main-view/main-view.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { MessageModule } from 'primeng/message';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';
import { FrontGlobalImagesModule } from '@lotus/front-global/images';
import { SecuritySettingsComponent } from './components/security-settings/security-settings.component';
import { EmailChangeStepOneComponent } from './components/security-settings/email-change-step-one/email-change-step-one.component';
import { EmailChangeStepTwoComponent } from './components/security-settings/email-change-step-two/email-change-step-two.component';
import { InputTextModule } from 'primeng/inputtext';
import {
  CircularTimerComponent,
  FrontGlobalCircularTimerModule,
} from '@lotus/front-global/circular-timer';
import { ChangePasswordComponent } from './components/security-settings/change-password/change-password.component';
import { PredefinedDataManager } from '@lotus/front-global/predefined-data';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(frontGlobalAccountSettingPagesRoutes),
    RouterModule,
    FrontGlobalSidebarModule,
    MessageModule,
    MessagesModule,
    SharedModule,
    MinkyReformNgxPrimeModule,
    FrontGlobalButtonModule,
    FrontGlobalImagesModule,
    InputTextModule,
    FrontGlobalCircularTimerModule,
    UbsTranslatorNgxModule,
  ],
  declarations: [
    MainViewComponent,
    AccountInformationComponent,
    ProfilePhotoComponent,
    SecuritySettingsComponent,
    EmailChangeStepOneComponent,
    EmailChangeStepTwoComponent,
    ChangePasswordComponent,
  ],
  exports: [
    MainViewComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
  ],
  providers: [PredefinedDataManager],
})
export class FrontGlobalAccountSettingPagesModule {}
