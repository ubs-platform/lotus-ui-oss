import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './components/registration/registration.component';
import { RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalRegistrationRoutingModule } from './front-global-registration.routing.module';
import { CaptachaComponent } from './components/captacha/captacha.component';
// import { CaptchaModule } from 'primeng/captcha';
import { InformationTabComponent } from './components/information-tab/information-tab.component';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import {
  TranslatorRepositoryService,
  UbsTranslatorNgxModule,
} from '@ubs-platform/translator-ngx';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RegistrationCompletionComponent } from './components/registration-completion/registration-completion.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StepsModule,
    ButtonModule,
    FrontGlobalButtonModule,
    FrontGlobalRegistrationRoutingModule,
    // CaptchaModule,
    MinkyReformNgxPrimeModule,
    UbsTranslatorNgxModule,
    CheckboxModule,
    FormsModule,
  ],
  declarations: [
    RegistrationComponent,
    CaptachaComponent,
    InformationTabComponent,
    RegistrationCompletionComponent,
  ],
  exports: [RegistrationCompletionComponent],
})
export class FrontGlobalRegistrationModule {}
