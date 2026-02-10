import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeChatService } from './service/realtime-chat.service';
import { SessionUserService } from './service/session-user.service';
import { LlmModelsService } from './service/llm-models.service';

@NgModule({
  imports: [CommonModule],
  providers: [RealtimeChatService, SessionUserService, LlmModelsService],
})
export class SuperlamaClientModule {}
