import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchPaginationComponent } from './components/touch-pagination/touch-pagination.component';
import { BlockNavigationDirective } from './components/block-navigation.directive';
import { TouchTabComponent } from './components/touch-tab/touch-tab.component';
import { UzayduzlemComponent } from './components/uzayduzlem/uzayduzlem.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TouchPaginationComponent,
    BlockNavigationDirective,
    TouchTabComponent,
    UzayduzlemComponent,
  ],
  exports: [
    TouchPaginationComponent,
    BlockNavigationDirective,
    TouchTabComponent,
    UzayduzlemComponent,
  ],
})
export class UbsTouchNgxModule {}
