import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchPaginationComponent } from './components/touch-pagination/touch-pagination.component';
import { BlockNavigationDirective } from './components/block-navigation.directive';
import { TouchTabComponent } from './components/touch-tab/touch-tab.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TouchPaginationComponent,
    BlockNavigationDirective,
    TouchTabComponent,
  ],
  exports: [
    TouchPaginationComponent,
    BlockNavigationDirective,
    TouchTabComponent,
  ],
})
export class UbsTouchNgxModule {}
