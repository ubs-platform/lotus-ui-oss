import { NgModule, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  AuthManagementService,
  AuthModule,
  AuthService,
  RoleService,
} from '@lotus/front-global/auth';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  LANGUAGE_JSON_URL,
  TranslatorRepositoryService,
} from '@ubs-platform/translator-ngx';
import { EnvironmentController } from '@ubs-platform/translator-core';
import { FrontGlobaErrorStatusPagesModule } from '@lotus/front-global/error-status-pages';
import { LotusFrontendSharedModule } from '@lotus/lotus-frontend/shared';
import {
  CustomHeaderHolderService,
  FrontGlobalUiPageContainerModule,
} from '@lotus/front-global/ui/page-container';
import { RouterModule } from '@angular/router';
import { LoadingIndicatorModule } from '@lotus/front-global/loading-indicator';
import { FrontGlobalMobileGesturesUtilModule } from '@lotus/front-global/mobile-gestures-util';
import {
  FrontGlobalFeedbackDialogModule,
  FeedbackDialogService,
} from '@lotus/front-global/feedback-dialog';
import { FrontGlobalUserServiceWrapsModule } from '@lotus/front-global/user-service-wraps';
import { registerLocaleData } from '@angular/common';
import turkish from '@angular/common/locales/tr';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
// its vertical im dumb
import { ServiceWorkerModule } from '@angular/service-worker';
import { FrontGlobalPromptOverlaysModule } from '@lotus/front-global/prompt-overlays';
import { IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { MarkdownFileVolatilityService } from '@lotus/front-global/markdown-editor';
import { MinkyReformNgxPrimeModule } from '../../../../../libs/front-global/minky/reform-ngx-prime/src/lib/front-global-minky-reform-ngx-prime.module';
import { WebdialogComponent, WebdialogHandler } from '@lotus/front-global/webdialog';
import { CoretoolComponent } from './components/coretool/coretool.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
EnvironmentController.getEnvironmentController('tr-tr', true);
registerLocaleData(turkish);
@NgModule({
  declarations: [AppComponent, CoretoolComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    AuthModule,
    ConfirmDialogModule,
    LotusFrontendSharedModule,
    FrontGlobalUiPageContainerModule,
    LoadingIndicatorModule,
    FrontGlobalMobileGesturesUtilModule,
    FrontGlobalFeedbackDialogModule,
    FrontGlobalUserServiceWrapsModule,
    FrontGlobalPromptOverlaysModule,
    FrontGlobalButtonModule,
    // MonacoEditorModule.forRoot(),

    MinkyReformNgxPrimeModule,
    WebdialogComponent,
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'TR-tr' },
    MessageService,
    ConfirmationService,
    {
      provide: LANGUAGE_JSON_URL,
      useValue: [(lang: string) => `localization/${lang}.json`],
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
    WebdialogHandler,
    provideExperimentalZonelessChangeDetection()

  ],
  exports: [CoretoolComponent],
})
export class AppModule {}
