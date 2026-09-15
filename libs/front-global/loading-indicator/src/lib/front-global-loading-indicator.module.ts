import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularLoadingIndicatorComponent } from './circular-loading-indicator/circular-loading-indicator.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FullscreenLoadingIndicatorComponent } from './fullscreen-loading-indicator/fullscreen-loading-indicator.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
@NgModule({
  imports: [CommonModule, ProgressSpinnerModule, UbsTranslatorNgxModule],
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
