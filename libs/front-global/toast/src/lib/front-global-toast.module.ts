import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastHostComponent } from './component/toast-host.component';

@NgModule({
  imports: [CommonModule, ToastHostComponent],
  exports: [ToastHostComponent],
})
export class FrontGlobalToastModule {}