import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';

@Component({
  selector: 'lib-pwa-update-version',
  imports: [CommonModule, FrontGlobalButtonModule],
  templateUrl: './pwa-update-version.component.html',
  styleUrl: './pwa-update-version.component.scss',
  standalone: true,
})
export class PwaUpdateVersionComponent {
  currentVersionStatus:
    | 'VERSION_DETECTED'
    | 'VERSION_INSTALLATION_FAILED'
    | 'VERSION_READY'
    | 'NO_NEW_VERSION_DETECTED' = 'NO_NEW_VERSION_DETECTED';
  readonly maxTry = 3;
  tryCount = 0;
  onUpdate = false;
  /**
   *
   */
  constructor(
    private overlayService: BasicOverlayService,
    private loadingService: LoadingIndicationService,
    @Optional() private swUpdate?: SwUpdate
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.swUpdate) {
      setTimeout(() => {
        this.swUpdate!.versionUpdates.subscribe((event) => {
          this.currentVersionStatus = event.type;
        });
        this.swUpdate!.checkForUpdate().then((a) => {});
      }, 2000);
    } else {
      this.currentVersionStatus = 'NO_NEW_VERSION_DETECTED';
    }
  }

  update() {
    this.overlayService
      .confirm(
        'Yeni sürüm kurulumu',
        "Evet'e bastığınız anda sayfa yenilenecektir. Eğer kaydetmediğiniz önemli bir değişikliğiniz varsa kurulumu sonra da yapabilirsiniz. Şimdi yüklensin mi?"
      )
      .subscribe((a) => {
        if (a) {
          this.onUpdate = true;
          this.loadingService.register({ name: 'Update', show: true });

          this.swUpdate!.activateUpdate()
            .then(() => {
              if (this.onUpdate) {
                setInterval(() => {
                  if (
                    this.currentVersionStatus == 'VERSION_READY' ||
                    this.tryCount >= this.maxTry
                  ) {
                    this.loadingService.register({
                      name: 'Update',
                      show: false,
                    });
                    this.onUpdate = false;
                    document.location.reload();
                  } else if (
                    this.currentVersionStatus == 'VERSION_INSTALLATION_FAILED'
                  ) {
                    this.updateError(null);
                  }
                  this.tryCount++;
                }, 2000);
              }
            })
            .catch((error) => {
              this.updateError(error);
            });
        } else {
          this.onUpdate = false;
        }
      });
  }

  private updateError(error?: any) {
    this.overlayService.alert(
      'Kurulum esnasında bir hata oluştu',
      'Lütfen tekrar deneyin',
      'warn'
    );
    this.onUpdate = false;
    console.error('Failed to apply updates:', error);
    this.loadingService.register({ name: 'Update', show: false });
  }
}
