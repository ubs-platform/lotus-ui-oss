import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArraySplitPipe } from './array-split.pipe';
import { CleanPipe } from './clean.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ArraySplitPipe, CleanPipe],
  exports: [ArraySplitPipe, CleanPipe],
})
export class GlobalPipesModule {}
