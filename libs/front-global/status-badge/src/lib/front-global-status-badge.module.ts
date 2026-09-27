import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

@NgModule({
  imports: [CommonModule, UbsTranslatorNgxModule],
  declarations: [StatusBadgeComponent],
  exports: [StatusBadgeComponent],
})
export class FrontGlobalStatusBadgeModule {}