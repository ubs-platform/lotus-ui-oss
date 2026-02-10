import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FrontGlobalButtonModule, RouterModule],
  declarations: [],
  exports: [],
})
export class FrontGlobalPageGroupingUtilsModule {}
