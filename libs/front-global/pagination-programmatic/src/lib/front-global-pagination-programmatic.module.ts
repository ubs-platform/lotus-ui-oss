import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsTouchNgxModule } from '@lotus/front-global/ubs-touch-ngx';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { GlobalPipesModule } from '@lotus/front-global/global-pipes';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { BPaginationProgrammaticComponent } from './b-pagination-programmatic/b-pagination-programmatic.component';
import { CustomItemDirective } from './b-pagination-programmatic/custom-item-directive.directive';

@NgModule({
  imports: [
    CommonModule,
    UbsTouchNgxModule,
    UbsTranslatorNgxModule,
    GlobalPipesModule,
    FrontGlobalButtonModule,
  ],
  declarations: [BPaginationProgrammaticComponent, CustomItemDirective],
  exports: [BPaginationProgrammaticComponent, CustomItemDirective],
})
export class FrontGlobalPaginationProgrammaticModule {}
