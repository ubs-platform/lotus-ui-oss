import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMessageDialogComponent } from './component/user-message-dialog/user-message-dialog.component';
import { FeedbackDialogService } from './service/user-message-dialog.service';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobalMessageModule } from '@lotus/front-global/message';
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
    FrontGlobalMessageModule,
    FrontGlobalButtonModule,
    FrontGlobalFeedbackFrontModule,
    FrontGlobalMinkyReformNgxMonaModule,
  ],
  providers: [FeedbackDialogService],
  declarations: [UserMessageDialogComponent],
})
export class FrontGlobalFeedbackDialogModule {}
