import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

interface PaymentCleanupPreview {
    before?: string;
    paymentIds: string[];
    preservedReportQueryCount: number;
    affectedReportIds: string[];
    counts: Record<string, number>;
    warnings: string[];
}

interface PaymentArchiveManifest {
    id: string;
    dumpPath: string;
    checksum: string;
    createdAt: string;
    before?: string;
    paymentCount: number;
}

interface PaymentArchiveSummary {
    id: string;
    checksum: string;
    createdAt: string;
    before?: string;
    paymentCount: number;
    available: boolean;
}

@Component({
    selector: 'postral-core-admin-operations',
    standalone: false,
    templateUrl: './admin-operations.component.html',
    styleUrls: ['./admin-operations.component.scss'],
})
export class AdminOperationsComponent implements OnInit {

    readonly adminOpsUrl = '/service/payment/api/admin-operations';
    paymentCleanupPreview?: PaymentCleanupPreview;
    paymentArchive?: PaymentArchiveManifest;
    paymentArchives: PaymentArchiveSummary[] = [];
    paymentCleanupLoading = false;
    constructor(private http: HttpClient, private basicOverlay: BasicOverlayService) { }

    ngOnInit(): void {
        this.loadPaymentArchives();
    }

    encryptSensitiveData() {
        this.basicOverlay.confirm('postral.admin.overlay.encrypt-title', 'postral.admin.overlay.encrypt-message').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/encrypt-sensitive-data', {}).subscribe({
                    next: () => {
                        // Hayır tamamlıyor :d
                        this.basicOverlay.alert('postral.admin.overlay.encrypt-success-title', 'postral.admin.overlay.encrypt-success-message', 'success');
                    },
                    error: (err) => {
                        console.error('Error initiating encryption:', err);
                        this.basicOverlay.alert('postral.admin.overlay.encrypt-error-title', 'postral.admin.overlay.operation-error', 'error');
                    }
                });
            }
        });
    }

    decryptSensitiveData() {
        this.basicOverlay.confirm('postral.admin.overlay.decrypt-title', 'postral.admin.overlay.decrypt-message').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/decrypt-sensitive-data', {}).subscribe({
                    next: () => {
                        this.basicOverlay.alert('postral.admin.overlay.decrypt-success-title', 'postral.admin.overlay.decrypt-success-message', 'success');
                    },
                    error: (err) => {
                        console.error('Error initiating decryption:', err);
                        this.basicOverlay.alert('postral.admin.overlay.decrypt-error-title', 'postral.admin.overlay.operation-error', 'error');
                    }
                });
            }
        });
    }

    startBillingProcess() {
        this.basicOverlay.confirm('postral.admin.overlay.billing-title', 'postral.admin.overlay.billing-message').subscribe(confirmed => {
            if (confirmed) {
                this.http.post(this.adminOpsUrl + '/run-billing', {}).subscribe({
                    next: () => {
                        this.basicOverlay.alert('postral.admin.overlay.billing-success-title', 'postral.admin.overlay.billing-success-message', 'success');
                    },
                    error: (err) => {
                        console.error('Error initiating billing process:', err);
                        this.basicOverlay.alert('postral.admin.overlay.billing-error-title', 'postral.admin.overlay.operation-error', 'error');
                    }
                });
            }
        });
    }

    previewPaymentCleanup(before: string): void {
        this.paymentCleanupLoading = true;
        this.paymentCleanupPreview = undefined;
        const body = before ? { before: `${before}T00:00:00.000Z` } : {};

        this.http.post<PaymentCleanupPreview>(this.adminOpsUrl + '/payment-cleanup/preview', body).subscribe({
            next: (preview) => {
                this.paymentCleanupPreview = preview;
                this.paymentCleanupLoading = false;
            },
            error: (err) => {
                this.paymentCleanupLoading = false;
                this.basicOverlay.alert(
                    'postral.admin.overlay.preview-error-title',
                    'postral.admin.overlay.operation-error',
                    'error',
                );
            },
        });
    }

    archivePaymentCleanup(before: string): void {
        this.paymentCleanupLoading = true;
        const body = before ? { before: `${before}T00:00:00.000Z` } : {};

        this.http.post<PaymentArchiveManifest>(this.adminOpsUrl + '/payment-cleanup/archive', body).subscribe({
            next: (archive) => {
                this.paymentArchive = archive;
                this.paymentCleanupLoading = false;
                this.basicOverlay.alert('postral.admin.overlay.archive-ready-title', 'postral.admin.overlay.archive-ready-message', 'success');
            },
            error: (err) => {
                this.paymentCleanupLoading = false;
                this.basicOverlay.alert('postral.admin.overlay.archive-error-title', 'postral.admin.overlay.operation-error', 'error');
            },
        });
    }

    downloadPaymentArchive(): void {
        if (!this.paymentArchive) return;
        this.downloadArchiveById(this.paymentArchive.id);
    }

    loadPaymentArchives(): void {
        this.http.get<PaymentArchiveSummary[]>(this.adminOpsUrl + '/payment-cleanup/archives').subscribe({
            next: (archives) => {
                this.paymentArchives = archives;
            },
            error: (err) => {
                this.basicOverlay.alert('postral.admin.overlay.archive-list-error-title', 'postral.admin.overlay.operation-error', 'error');
            },
        });
    }

    downloadArchiveById(archiveId: string): void {
        this.http.get(this.adminOpsUrl + `/payment-cleanup/archive/${archiveId}`, { responseType: 'blob' }).subscribe({
            next: (file) => {
                const url = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${archiveId}.sql`;
                link.click();
                URL.revokeObjectURL(url);
            },
            error: (err) => {
                this.basicOverlay.alert('postral.admin.overlay.archive-download-error-title', 'postral.admin.overlay.operation-error', 'error');
            },
        });
    }

    deletePaymentData(): void {
        if (!this.paymentArchive) return;
        this.basicOverlay.confirm(
            'postral.admin.overlay.delete-title',
            'postral.admin.overlay.delete-message',
        ).subscribe(confirmed => {
            if (!confirmed || !this.paymentArchive) return;
            this.paymentCleanupLoading = true;
            const body = {
                archiveId: this.paymentArchive.id,
                confirmation: 'DELETE_PAYMENT_DATA',
                ...(this.paymentArchive.before ? { before: this.paymentArchive.before } : {}),
            };
            this.http.post<PaymentCleanupPreview>(this.adminOpsUrl + '/payment-cleanup/cleanup', body).subscribe({
                next: (result) => {
                    this.paymentCleanupPreview = result;
                    this.paymentArchive = undefined;
                    this.paymentCleanupLoading = false;
                    this.basicOverlay.alert('postral.admin.overlay.delete-success-title', 'postral.admin.overlay.delete-success-message', 'success');
                },
                error: (err) => {
                    this.paymentCleanupLoading = false;
                    this.basicOverlay.alert('postral.admin.overlay.delete-error-title', 'postral.admin.overlay.operation-error', 'error');
                },
            });
        });
    }

    cleanPaymentData(): void {
        if (!this.paymentCleanupPreview) return;
        this.basicOverlay.confirm(
            'postral.admin.overlay.delete-title',
            'postral.admin.overlay.delete-message',
        ).subscribe(confirmed => {
            if (!confirmed) return;
            this.paymentCleanupLoading = true;
            const archiveBody = this.paymentCleanupPreview?.before
                ? { before: this.paymentCleanupPreview.before }
                : {};
            this.http.post<PaymentArchiveManifest>(this.adminOpsUrl + '/payment-cleanup/archive', archiveBody).subscribe({
                next: (archive) => {
                    const cleanupBody = {
                        archiveId: archive.id,
                        confirmation: 'DELETE_PAYMENT_DATA',
                        ...(archive.before ? { before: archive.before } : {}),
                    };
                    this.http.post<PaymentCleanupPreview>(this.adminOpsUrl + '/payment-cleanup/cleanup', cleanupBody).subscribe({
                        next: (result) => {
                            this.paymentCleanupPreview = result;
                            this.paymentCleanupLoading = false;
                            this.basicOverlay.alert('postral.admin.overlay.delete-success-title', 'postral.admin.overlay.delete-success-message', 'success');
                        },
                        error: (err) => {
                            this.paymentCleanupLoading = false;
                            this.basicOverlay.alert('postral.admin.overlay.delete-error-title', 'postral.admin.overlay.delete-after-archive-error', 'error');
                        },
                    });
                },
                error: (err) => {
                    this.paymentCleanupLoading = false;
                    this.basicOverlay.alert('postral.admin.overlay.archive-error-title', 'postral.admin.overlay.archive-before-delete-error', 'error');
                },
            });
        });
    }
}
