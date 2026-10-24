import { FrontGlobalPromptOverlaysModule } from '@lotus/front-global/prompt-overlays';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrontGlobalToastModule } from '@lotus/front-global/toast';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobaErrorStatusPagesModule } from '@lotus/front-global/error-status-pages';
import { FrontGlobalUiPageContainerModule } from '@lotus/front-global/ui/page-container';
import { LoadingIndicatorModule } from '@lotus/front-global/loading-indicator';
import { FrontGlobalMobileGesturesUtilModule } from '@lotus/front-global/mobile-gestures-util';
import { FrontGlobalFeedbackDialogModule } from '@lotus/front-global/feedback-dialog';
import { FrontGlobalUserServiceWrapsModule } from '@lotus/front-global/user-service-wraps';
import turkish from '@angular/common/locales/tr';
import { WebdialogComponent } from '@lotus/front-global/webdialog';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import {
  FrontGlobalAppEssentialModule,
  provideFrontGlobal,
} from '@lotus/front-global/app-essential';

import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { WarningWatermarkComponent } from '@lotus/front-global/warning-watermark';
import { CustomSelectComponent } from '@lotus/legendary-front/custom-select';
import { ToggleComponent } from '@lotus/front-global/input/toggle';
import { OverlayPanelComponent, PTooltipDirective } from '@lotus/front-global/overlay-panel';
@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FrontGlobalToastModule,
    FrontGlobaErrorStatusPagesModule,
    FrontGlobalUiPageContainerModule,
    LoadingIndicatorModule,
    FrontGlobalMobileGesturesUtilModule,
    FrontGlobalFeedbackDialogModule,
    FrontGlobalUserServiceWrapsModule,
    FrontGlobalPromptOverlaysModule,
    FrontGlobalAppEssentialModule,
    MinkyReformNgxPrimeModule,
    WebdialogComponent,
    FrontGlobalButtonModule,
    FrontGlobalSidebarModule,
    WarningWatermarkComponent,
    CustomSelectComponent,
    ToggleComponent,
    UbsTranslatorNgxModule,
    OverlayPanelComponent,
    PTooltipDirective
],
  providers: [
    provideFrontGlobal({
      language: 'tr-tr',
      localeData: turkish,
      translationUrls: [(lang: string) => 'localization/' + lang + '.json'],
    }),
    provideZonelessChangeDetection(),
  ],
})
export class AppModule {}
