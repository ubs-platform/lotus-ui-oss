import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { WebdialogHandler } from '@lotus/front-global/webdialog';
import { FrontGlobalFeedbackFrontModule } from '@lotus/front-global/feedback-front';
import { ContentReportService } from './content-report.service';

@NgModule({
  imports: [CommonModule, FrontGlobalFeedbackFrontModule],
  providers: [ContentReportService, BasicOverlayService, WebdialogHandler],
})
export class ContentReportModule {}
