import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { RouterModule } from '@angular/router';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { SuspendedPageComponent } from './suspended-page/suspended-page.component';
import { MessageModule } from 'primeng/message';
import { CustomErrorMessageComponent } from './custom-error-message/custom-error-message.component';

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalButtonModule,
    RouterModule,
    UbsTranslatorNgxModule,
    MessageModule,
  ],
  declarations: [
    CustomErrorMessageComponent,
    NotFoundPageComponent,
    SuspendedPageComponent,
  ],
  exports: [NotFoundPageComponent, CustomErrorMessageComponent],
})
export class FrontGlobaErrorStatusPagesModule {}
