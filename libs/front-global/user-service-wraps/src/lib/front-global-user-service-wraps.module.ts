import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingIndicationService, MessageWrapService } from './service';

@NgModule({
  imports: [CommonModule],
  providers: [LoadingIndicationService, MessageWrapService],
})
export class FrontGlobalUserServiceWrapsModule {}
