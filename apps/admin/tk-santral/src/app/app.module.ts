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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { RouterModule } from '@angular/router';
import { FrontGlobalMobileGesturesUtilModule } from '@lotus/front-global/mobile-gestures-util';
import { FrontGlobalFeedbackDialogModule } from '@lotus/front-global/feedback-dialog';
import { FrontGlobalUserServiceWrapsModule } from '@lotus/front-global/user-service-wraps';
import { LoadingIndicatorModule } from '@lotus/front-global/loading-indicator';
import { AdminFrontLotusParentModule } from '@lotus/admin-front/lotus-adm-parent';
import { AdminFrontCommonModule } from '@lotus/admin-front/common';
import { IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { MarkdownFileVolatilityService } from '@lotus/front-global/markdown-editor';
import { ApplicationSocialRestrictionAdminService } from '@lotus/front-global/social-application-restriction';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { WebdialogHandler } from '@lotus/front-global/webdialog';

EnvironmentController.getEnvironmentController('tr-tr', true);

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    AuthModule,
    AdminFrontLotusParentModule,
    AdminFrontCommonModule,
    FrontGlobalUiPageContainerModule,
    FrontGlobalMobileGesturesUtilModule,
    FrontGlobalFeedbackDialogModule,
    FrontGlobalUserServiceWrapsModule,
    LoadingIndicatorModule,
    FrontGlobalPromptOverlaysModule,
    FrontGlobalButtonModule,
  ],
  providers: [
    ThemeManager,
    // { provide: LOCALE_ID, useValue: 'TR-tr' },
    MessageService,
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
    provideHttpClient(withInterceptorsFromDi()),
    MarkdownFileVolatilityService,
    ApplicationSocialRestrictionAdminService,
    WebdialogHandler,
  ],
})
export class AppModule {}
