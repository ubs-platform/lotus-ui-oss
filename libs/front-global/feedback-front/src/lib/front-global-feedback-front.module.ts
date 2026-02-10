import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMessageService } from './service/user-message.service';

@NgModule({
  imports: [CommonModule],
  providers: [UserMessageService],
})
export class FrontGlobalFeedbackFrontModule {}
