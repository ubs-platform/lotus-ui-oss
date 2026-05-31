import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListMinimalComponent } from './components/invoice-list-minimal/invoice-list-minimal.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { IconComponent } from "@lotus/front-global/icon";

@NgModule({
  imports: [CommonModule, FrontGlobalButtonModule, IconComponent],
  declarations: [InvoiceListMinimalComponent],
  exports: [InvoiceListMinimalComponent],
})
export class InvoiceModule {}
