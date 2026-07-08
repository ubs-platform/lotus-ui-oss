import { FrontGlobalPromptOverlaysModule } from '@lotus/front-global/prompt-overlays';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  AuthManagementService,
  AuthModule,
  AuthService,
  RoleService,
} from '@lotus/front-global/auth';
import {
  LANGUAGE_JSON_URL,
  TranslatorRepositoryService,
} from '@ubs-platform/translator-ngx';
import { EnvironmentController } from '@ubs-platform/translator-core';
import { FrontGlobaErrorStatusPagesModule } from '@lotus/front-global/error-status-pages';
import {
  CustomHeaderHolderService,
  FrontGlobalUiPageContainerModule,
} from '@lotus/front-global/ui/page-container';
import { LoadingIndicatorModule } from '@lotus/front-global/loading-indicator';
import { FrontGlobalMobileGesturesUtilModule } from '@lotus/front-global/mobile-gestures-util';
import {
  FrontGlobalFeedbackDialogModule,
} from '@lotus/front-global/feedback-dialog';
import { FrontGlobalUserServiceWrapsModule } from '@lotus/front-global/user-service-wraps';
import { registerLocaleData } from '@angular/common';
import turkish from '@angular/common/locales/tr';
// its vertical im dumb
import { IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { MarkdownFileVolatilityService } from '@lotus/front-global/markdown-editor';
import { WebdialogComponent, WebdialogHandler } from '@lotus/front-global/webdialog';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { FrontGlobalAppEssentialModule } from '../../../../../libs/front-global/app-essential/src/lib/front-global-app-essential.module';

import { FrontGlobalSidebarModule } from "@lotus/front-global/sidebar";
import { PostralCoreAdminModule } from '@lotus/postral-core-frontend/admin';
import { WarningWatermarkComponent } from '@lotus/front-global/warning-watermark';
import { CustomSelectComponent } from '@lotus/legendary-front/custom-select';
import { ToggleComponent } from "@lotus/front-global/input/toggle";
EnvironmentController.getEnvironmentController('tr-tr', true);
registerLocaleData(turkish);
@NgModule({
  declarations: [
    AppComponent,

  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    AuthModule,
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
    WebdialogComponent,
    FrontGlobalAppEssentialModule,
    FrontGlobalSidebarModule,
    PostralCoreAdminModule,
    WarningWatermarkComponent,
    CustomSelectComponent,
    ToggleComponent
],
  providers: [
    // { provide: LOCALE_ID, useValue: 'TR-tr' },
    WebdialogHandler,
    MessageService,
    {
      provide: LANGUAGE_JSON_URL,
      useValue: [(lang: string) => 'localization/' + lang + '.json'],
    },
    TranslatorRepositoryService,
    FrontGlobaErrorStatusPagesModule,
    AuthManagementService,
    AuthService,
    CustomHeaderHolderService,
    RoleService,
    IndexAutoLoader,
    ThemeManager,
    provideHttpClient(withInterceptorsFromDi()),
    MarkdownFileVolatilityService,
  ],
})
export class AppModule { }
