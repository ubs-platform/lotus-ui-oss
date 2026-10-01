import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { frontGlobalLoginPagesRoutes } from './lib.routes';
import { FrontGlobalAuthLoginViewsModule } from '@lotus/front-global/auth-login-views';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { LoginPageComponent } from './login-page/login-page.component';
import { FrontGlobalMessageModule } from '@lotus/front-global/message';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(frontGlobalLoginPagesRoutes),
    RouterModule,
    MinkyReformNgxPrimeModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    FrontGlobalAuthLoginViewsModule,
    FrontGlobalMessageModule,
  ],
  declarations: [LoginPageComponent],
})
export class FrontGlobalLoginPagesModule {}
