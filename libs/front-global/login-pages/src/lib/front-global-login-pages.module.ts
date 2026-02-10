import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { frontGlobalLoginPagesRoutes } from './lib.routes';
import { FrontGlobalAuthLoginViewsModule } from '@lotus/front-global/auth-login-views';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { LoginPageComponent } from './login-page/login-page.component';
import { MessageModule } from 'primeng/message';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(frontGlobalLoginPagesRoutes),
    RouterModule,
    CommonModule,
    DynamicDialogModule,
    MinkyReformNgxPrimeModule,
    ButtonModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    FrontGlobalAuthLoginViewsModule,
    MessageModule,
  ],
  declarations: [LoginPageComponent],
})
export class FrontGlobalLoginPagesModule {}
