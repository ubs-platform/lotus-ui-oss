import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';
import { FrontGlobalDebugToolsModule } from '@lotus/front-global/debug-tools';

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalButtonModule,
    ColorPickerModule,
    FormsModule,
    OverlayPanelModule,
    SliderModule,
    FrontGlobalDebugToolsModule,
  ],
  declarations: [DrawableCanvasComponent],
  exports: [DrawableCanvasComponent],
})
export class FrontGlobalDrawableCanvasModule {}
