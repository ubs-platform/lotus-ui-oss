import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { RouterModule } from '@angular/router';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { SuspendedPageComponent } from './suspended-page/suspended-page.component';
import { CustomErrorMessageComponent } from './custom-error-message/custom-error-message.component';
import { IconComponent } from "@lotus/front-global/icon";

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalButtonModule,
    RouterModule,
    UbsTranslatorNgxModule,
    IconComponent
],
  declarations: [
    CustomErrorMessageComponent,
    NotFoundPageComponent,
    SuspendedPageComponent,
  ],
  exports: [NotFoundPageComponent, CustomErrorMessageComponent],
})
export class FrontGlobaErrorStatusPagesModule {}
