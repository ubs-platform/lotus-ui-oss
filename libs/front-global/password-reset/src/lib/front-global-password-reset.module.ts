import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './components/password-reset-main/password-reset-main.component';
import { RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalPasswordResetRoutingModule } from './front-global-password-reset.routing.module';
// import { CaptchaModule } from 'primeng/captcha';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import {
  TranslatorRepositoryService,
  UbsTranslatorNgxModule,
} from '@ubs-platform/translator-ngx';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InitTabComponent } from './components/init-tab/init-tab.component';
import { SecondStepFormComponent } from './components/second-step-form/second-step-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StepsModule,
    ButtonModule,
    FrontGlobalButtonModule,
    FrontGlobalPasswordResetRoutingModule,
    // CaptchaModule,
    MinkyReformNgxPrimeModule,
    UbsTranslatorNgxModule,
    CheckboxModule,
    FormsModule,
  ],
  declarations: [
    RegistrationComponent,
    InitTabComponent,
    SecondStepFormComponent,
  ],
})
export class FrontGlobalPasswordResetModule {}
