import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericAppHeaderComponent } from './generic-app-header/generic-app-header.component';
import { FrontGlobalAuthLoginViewsModule } from '@lotus/front-global/auth-login-views';
import { RouterModule } from '@angular/router';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import {
  LANGUAGE_JSON_URL,
  UbsTranslatorNgxModule,
} from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobalDebugToolsModule } from '@lotus/front-global/debug-tools';
import { ApplicationLogoDirective } from './application-logo.directive';
import { ApplicationFooterDirective } from './application-footer.directive';
import { PwaUpdateVersionComponent } from '@lotus/front-global/pwa-update-version';
import { WebdialogComponent } from '@lotus/front-global/webdialog';
import { OnmobileHeaderComponent, OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
@NgModule({
  imports: [
    CommonModule,
    FrontGlobalAuthLoginViewsModule,
    RouterModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    FrontGlobalDebugToolsModule,
    PwaUpdateVersionComponent,
    WebdialogComponent,
    OnmobileHeaderComponent,
    OnpageHeaderComponent
],
  declarations: [
    GenericAppHeaderComponent,
    ApplicationLogoDirective,
    ApplicationFooterDirective,
  ],
  exports: [
    GenericAppHeaderComponent,
    ApplicationLogoDirective,
    ApplicationFooterDirective,
  ],
  providers: [],
})
export class FrontGlobalAppEssentialModule {}
