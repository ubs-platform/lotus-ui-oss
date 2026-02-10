import { contentChildren, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataListLayoutComponent } from './data-list-layout.component';
import { ActionItemDirective } from './action-item.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DataListLayoutComponent, ActionItemDirective],
  exports: [DataListLayoutComponent, ActionItemDirective],
})
export class DataListLayoutModule {
}
