import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularTimerComponent } from './circular-timer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CircularTimerComponent],
  exports: [CircularTimerComponent],
})
export class FrontGlobalCircularTimerModule {}
