import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextNumberComponent } from './text-number/text-number.component';
import { TextNubmerGridComponent } from './text-number-grid/text-nubmer-grid.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TextNumberComponent, TextNubmerGridComponent],
  exports: [TextNumberComponent, TextNubmerGridComponent],
})
export class ReportUtilsModule {}
