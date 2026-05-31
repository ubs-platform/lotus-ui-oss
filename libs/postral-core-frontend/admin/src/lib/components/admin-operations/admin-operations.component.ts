import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
    selector: 'postral-core-admin-operations',
    standalone: false,
    templateUrl: './admin-operations.component.html',
    styleUrls: ['./admin-operations.component.scss'],
})
export class AdminOperationsComponent {

    readonly adminOpsUrl = '/service/payment/api/admin-operations';
    constructor(private http: HttpClient, private basicOverlay: BasicOverlayService) { }

    encryptSensitiveData() {
        this.basicOverlay.confirm("Tüm verileri şifrele", 'Tüm hassas verilerin şifrelenmesi işlemi başlatılacak. Bu işlem uzun sürebilir ve sunucu kaynaklarını yoğun şekilde kullanabilir. Devam etmek istediğinize emin misiniz?').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/encrypt-sensitive-data', {}).subscribe({
                    next: () => {
                        // Hayır tamamlıyor :d
                        this.basicOverlay.alert("Şifreleme tamamlandı", "Tüm hassas verilerin şifrelenmesi işlemi tamamlandı. Lütfen ilerleme için sunucu loglarını kontrol edin.", "success");
                    },
                    error: (err) => {
                        console.error('Error initiating encryption:', err);
                        this.basicOverlay.alert("Şifreleme hatası", "Hassas verilerin şifrelenmesi başlatılırken bir hata oluştu. " + (err.error?.message || err.message), "error");
                    }
                });
            }
        });
    }

    decryptSensitiveData() {
        this.basicOverlay.confirm("Tüm verilerin şifresini çöz", 'Tüm hassas verilerin şifresinin çözülmesi işlemi başlatılacak. Bu işlem uzun sürebilir ve sunucu kaynaklarını yoğun şekilde kullanabilir. Devam etmek istediğinize emin misiniz?').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/decrypt-sensitive-data', {}).subscribe({
                    next: () => {
                        this.basicOverlay.alert("Şifre çözme tamamlandı", "Tüm hassas verilerin şifresinin çözülmesi işlemi tamamlandı. Lütfen ilerleme için sunucu loglarını kontrol edin.", "success");
                    },
                    error: (err) => {
                        console.error('Error initiating decryption:', err);
                        this.basicOverlay.alert("Şifre çözme hatası", "Hassas verilerin şifresinin çözülmesi başlatılırken bir hata oluştu. " + (err.error?.message || err.message), "error");
                    }
                });
            }
        });
    }

    startBillingProcess() {
        this.basicOverlay.confirm("Faturalama işlemini başlat", 'Faturalama işlemi başlatılacak. Bu işlem uzun sürebilir ve sunucu kaynaklarını yoğun şekilde kullanabilir. Devam etmek istediğinize emin misiniz?').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/run-billing', {}).subscribe({
                    next: () => {
                        this.basicOverlay.alert("Faturalama işlemi başlatıldı", "Faturalama işlemi başarıyla başlatıldı. Lütfen ilerleme için sunucu loglarını kontrol edin.", "success");
                    },
                    error: (err) => {
                        console.error('Error initiating billing process:', err);
                        this.basicOverlay.alert("Faturalama hatası", "Faturalama işlemi başlatılırken bir hata oluştu. " + (err.error?.message || err.message), "error");
                    }
                });
            }
        });
    }
}
