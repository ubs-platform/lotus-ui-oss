import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { adminFrontendFeedbackAdminRoutes } from './lib.routes';
import { FeedbackListComponent } from './component/feedback-list/feedback-list.component';
import { FeedbackDetailsComponent } from './component/feedback-details/feedback-details.component';
import { FrontGlobalFeedbackFrontModule } from '@lotus/front-global/feedback-front';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FeedbackFilterComponent } from './component/feedback-filter/feedback-filter.component';
import { ReformNgxPrimeComponent } from 'libs/front-global/minky/reform-ngx-prime/src/lib/reform-ngx-prime/reform-ngx-prime.component';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FrontGlobalMarkdownEditorModule } from '@lotus/front-global/markdown-editor';

import { MessageModule } from 'primeng/message';
import { ResolveDialogComponent } from './component/resolve-dialog/resolve-dialog.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminFrontendFeedbackAdminRoutes),
    RouterModule,
    FrontGlobalFeedbackFrontModule,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    MinkyReformNgxPrimeModule,
    OverlayPanelModule,
    FrontGlobalMarkdownEditorModule,
    MessageModule,
    UbsTranslatorNgxModule,
    MinkyReformNgxModule,
    FrontGlobalMinkyReformNgxMonaModule,
  ],
  declarations: [
    FeedbackListComponent,
    FeedbackDetailsComponent,
    FeedbackFilterComponent,
    ResolveDialogComponent,
  ],
  exports: [
    FeedbackListComponent,
    FeedbackDetailsComponent,
    FeedbackFilterComponent,
    ResolveDialogComponent,
  ],
})
export class AdminFrontFeedbackModule {}
