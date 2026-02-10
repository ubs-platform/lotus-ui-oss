import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginDialogComponent } from './component/login-dialog/login-dialog.component';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { ButtonModule } from 'primeng/button';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DynamicDialogModule,
    MinkyReformNgxPrimeModule,
    ButtonModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    RouterModule,
  ],
  declarations: [LoginDialogComponent],
  exports: [LoginDialogComponent],
  providers: [DynamicDialogRef],
})
export class FrontGlobalAuthLoginViewsModule {}
