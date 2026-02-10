import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { environment } from '@lotus-web/environment';

@Component({
  selector: 'lotus-web-captacha',
  templateUrl: './captacha.component.html',
  styleUrls: ['./captacha.component.scss'],
  standalone: false,
})
export class CaptachaComponent implements OnInit {
  keyToken: any;
  developar: boolean = true;
  eulaEnabled = false;
  privacyEnabled = false;
  agreed = false;
  privacyAccepted = false;
  notBot = true;
  constructor(private router: Router, private overlay: BasicOverlayService) {
    // this.developar = !environment.production;
  }

  showEULAUpAndEnable() {
    const action = (a: boolean) => (this.agreed = a);
    const ok = this.agreed;
    this.showModal('/assets/texts/terms-of-usage/tr-tr.html', ok, action);
  }

  private showModal(url: string, ok: boolean, action: (a: boolean) => boolean) {
    if (ok) {
      // this.agreed = false;
      action(false);
    } else {
      this.overlay
        .showInstantModal({
          htmlContentUrl: url,
          yesButtonText: 'Kabul ediyorum',
          noButtonText: 'İptal',
        })
        .onClose()
        .subscribe((a) => {
          if (a) {
            action(true);
          }
        });
    }
  }

  showPrivacyUpAndEnable() {
    const action = (a: boolean) => (this.privacyAccepted = a);
    const ok = this.privacyAccepted;
    this.showModal('/assets/texts/privacy/tr-tr.html', ok, action);
  }

  ngOnInit(): void {}

  nextStep($event: any) {
    if (!this.agreed || !this.privacyAccepted) {
      this.overlay.alert(
        'İleri geçilemiyor',
        'Lütfen kullanım şartlarını ve gizlilik politikasını kabul edin',
        'error'
      );
    } else if (!this.notBot) {
      this.overlay.alert(
        'İleri geçilemiyor',
        'Lütfen bot olmadığınızı kanıtlayın',
        'error'
      );
    } else {
      this.router.navigate(['registration', 'information']);
    }
  }

  expire() {
    this.overlay.alert(
      'Doğrulama süresi doldu',
      'Lütfen bot olmadığınızı tekrar kanıtlayın',
      'warn'
    );
    this.notBot = false;
  }
}
