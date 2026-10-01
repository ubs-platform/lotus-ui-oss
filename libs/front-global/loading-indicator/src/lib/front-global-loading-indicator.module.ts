import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularLoadingIndicatorComponent } from './circular-loading-indicator/circular-loading-indicator.component';
import { FullscreenLoadingIndicatorComponent } from './fullscreen-loading-indicator/fullscreen-loading-indicator.component';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
@NgModule({
  imports: [CommonModule, UbsTranslatorNgxModule],
  declarations: [
    CircularLoadingIndicatorComponent,
    FullscreenLoadingIndicatorComponent,
  ],
  exports: [
    CircularLoadingIndicatorComponent,
    FullscreenLoadingIndicatorComponent,
  ],
})
export class LoadingIndicatorModule {}
