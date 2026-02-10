import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { UserMessageDialogComponent } from './component/user-message-dialog/user-message-dialog.component';
import { FeedbackDialogService } from './service/user-message-dialog.service';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { MessageModule } from 'primeng/message';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalFeedbackFrontModule } from '@lotus/front-global/feedback-front';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';

@NgModule({
  imports: [
    CommonModule,
    MinkyReformNgxPrimeModule,
    MinkyReformNgxModule,
    UbsTranslatorNgxModule,
    // FrontGlobalMarkdownEditorModule,
    MessageModule,
    FrontGlobalButtonModule,
    FrontGlobalFeedbackFrontModule,
    FrontGlobalMinkyReformNgxMonaModule,
  ],
  providers: [DialogService, FeedbackDialogService],
  declarations: [UserMessageDialogComponent],
})
export class FrontGlobalFeedbackDialogModule {}
