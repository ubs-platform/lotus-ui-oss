import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FormsModule } from '@angular/forms';
import { OverlayPanelComponent} from '@lotus/front-global/overlay-panel';
import { ToggleComponent } from "@lotus/front-global/input/toggle";

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalButtonModule,
    FormsModule,
    CommonModule,
    ToggleComponent,
    OverlayPanelComponent
],
  declarations: [DrawableCanvasComponent],
  exports: [DrawableCanvasComponent],
})
export class FrontGlobalDrawableCanvasModule {}
