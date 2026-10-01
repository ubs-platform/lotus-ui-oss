import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageComponent } from './component/message.component';

@NgModule({
  imports: [CommonModule, MessageComponent],
  exports: [MessageComponent],
})
export class FrontGlobalMessageModule {}