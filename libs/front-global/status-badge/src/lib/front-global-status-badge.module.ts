import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';

@NgModule({
  imports: [CommonModule, UbsTranslatorNgxModule],
  declarations: [StatusBadgeComponent],
  exports: [StatusBadgeComponent],
})
export class FrontGlobalStatusBadgeModule {}