import { Component, viewChild, ViewChild } from '@angular/core';
import { ImageUploadComponent } from '@lotus/front-global/images';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'lotus-web-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
  standalone: false,
})
export class ProfilePhotoComponent {
  uploader = viewChild<ImageUploadComponent>('uploader');
  constructor(private overlay: BasicOverlayService) {}
  sendRequest() {
    this.uploader()!
      .uploadImageOrContinue()
      .subscribe(
        () => {
          this.overlay.alert(
            'Profil resmi başarıyla değiştirildi',
            '',
            'success'
          );
        },
        () => {
          this.overlay.alert(
            'Profil resmi değiştirilirken bir hata ile karşılaşıldı',
            '',
            'error'
          );
        }
      );
  }
}
