import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from './services/images.service';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { ImageUrlPipe } from './pipe/image-url.pipe';

@NgModule({
  imports: [CommonModule, FrontGlobalButtonModule],
  declarations: [ImageUploadComponent, ImageUrlPipe],
  exports: [ImageUploadComponent],
  providers: [],
})
export class FrontGlobalImagesModule {}
