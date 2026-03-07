import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from './status-badge/status-badge.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StatusBadgeComponent],
  exports: [StatusBadgeComponent],
})
export class FrontGlobalStatusBadgeModule {}