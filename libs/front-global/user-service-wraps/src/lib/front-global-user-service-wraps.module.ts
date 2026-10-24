import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageWrapService } from './service';

@NgModule({
  imports: [CommonModule],
  providers: [MessageWrapService],
})
export class FrontGlobalUserServiceWrapsModule {}
