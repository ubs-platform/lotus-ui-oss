import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './components/registration/registration.component';
import { RouterModule } from '@angular/router';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalRegistrationRoutingModule } from './front-global-registration.routing.module';
import { CaptachaComponent } from './components/captacha/captacha.component';
import { InformationTabComponent } from './components/information-tab/information-tab.component';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import {
  UbsTranslatorNgxModule,
} from '@lotus/extra/ubs-translator-ngx';
import { FormsModule } from '@angular/forms';
import { RegistrationCompletionComponent } from './components/registration-completion/registration-completion.component';
import { ToggleComponent } from '@lotus/front-global/input/toggle';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FrontGlobalButtonModule,
    FrontGlobalRegistrationRoutingModule,
    // CaptchaModule,
    MinkyReformNgxPrimeModule,
    UbsTranslatorNgxModule,
    FormsModule,
    ToggleComponent
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
