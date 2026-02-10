import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSwipeListener } from './swipe-listener';
import { Subject } from 'rxjs';
import { InstantMovement } from './instant-movement.type';

@NgModule({
  imports: [CommonModule],
  providers: [DocumentSwipeListener],
})
export class FrontGlobalMobileGesturesUtilModule {}
