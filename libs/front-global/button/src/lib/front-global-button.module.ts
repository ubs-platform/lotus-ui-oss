import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockPartBaseComponent } from './block-part-base/block-part-base.component';
import { BlockPartBaseButtonComponent } from './block-part-base-button/block-part-base-button.component';
import { BButtonComponent } from './b-button/b-button.component';
// import { UbsTouchNgxModule } from '@lotus/front-global/ubs-touch-ngx';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { IconComponent } from '@lotus/front-global/icon';
import { GlobalPipesModule } from '@lotus/front-global/global-pipes';
import { PTooltipDirective } from '@lotus/front-global/overlay-panel';

@NgModule({
  imports: [
    CommonModule,
    // UbsTouchNgxModule,
    UbsTranslatorNgxModule,
    GlobalPipesModule,
    IconComponent,
    PTooltipDirective,
],
  declarations: [
    BlockPartBaseComponent,
    BlockPartBaseButtonComponent,
    BButtonComponent,
  ],
  exports: [
    BlockPartBaseComponent,
    BlockPartBaseButtonComponent,
    BButtonComponent,
  ],
})
export class FrontGlobalButtonModule { }
