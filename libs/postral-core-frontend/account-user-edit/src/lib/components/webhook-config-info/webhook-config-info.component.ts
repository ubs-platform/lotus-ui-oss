import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { WebhookConfigControllerService } from '@lotus/postral-core-frontend/client';
import { WebhookConfigForm } from '@lotus/postral-core-frontend/forms';
import { WebhookConfigDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
    selector: 'lib-webhook-config-info',
    standalone: false,
    templateUrl: './webhook-config-info.component.html',
    styleUrls: ['./webhook-config-info.component.scss'],
})
export class WebhookConfigInfoComponent {

    instruction = signal<FormEditInstruction | null>(null);
    existingId = signal<string | null>(null);
    createdEventKey = signal<string | null>(null);
    hasExistingConfig = computed(() => !!this.existingId());
    programmaticCopyEnabled = computed(() => (window.location.protocol === 'https:' || window.location.hostname === 'localhost'))
    isCopyDisabled = computed(() => !this.createdEventKey() && !this.programmaticCopyEnabled());

    constructor(
        private webhookConfigService: WebhookConfigControllerService,
        private activatedRoute: ActivatedRoute,
        private basicOverlay: BasicOverlayService,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            const accountId: string = params['accountId'];
            this.loadConfig(accountId);
        });
    }

    private loadConfig(accountId: string) {
        this.webhookConfigService.getByAccountId(accountId).subscribe({
            next: (data) => {
                this.existingId.set(data.id);
                const form = new Reform(WebhookConfigForm, { ...data, accountId });
                this.buildInstruction(form, accountId, data.id);
            },
            error: () => {
                // Kayıt yok — boş form
                const form = new Reform(WebhookConfigForm, { accountId, method: 'POST' });
                this.buildInstruction(form, accountId, null);
            },
        });
    }

    private buildInstruction(form: Reform, accountId: string, existingId: string | null) {
        this.instruction.set({
            form,
            extraActions: [
                {
                    stringContent: 'Yeni Event Key oluştur',
                    iconClass: 'material-symbols-outlined',
                    iconContent: 'key',
                    buttonClass: 'border',
                    renderIf: this.hasExistingConfig,
                    action: () => this.regenerateEventKey(),
                },
                {
                    stringContent: 'Webhook konfigürasyonunu sil',
                    iconClass: 'material-symbols-outlined',
                    iconContent: 'delete',
                    buttonClass: 'border text-danger',
                    renderIf: this.hasExistingConfig,
                    action: () => this.deleteConfig(),
                },
            ],
            onValidationError: (_form: Reform) => {
                this.basicOverlay.alert('Hata', 'Lütfen formu kontrol edin.', 'error');
            },
            beforeSave: (_form: Reform) => true,
            saveMethod: (data: any) => {
                if (existingId) {
                    const { accountId: _a, ...updateDto } = data;
                    return this.webhookConfigService.update(existingId, updateDto);
                }
                return this.webhookConfigService.create({ ...data, accountId });
            },
            afterSaveSuccess: (out: WebhookConfigDTO) => {
                this.basicOverlay.alert('general.success', 'Webhook konfigürasyonu kaydedildi.', 'success');
                this.existingId.set(out.id);
                if (out.eventKey && out.eventKey !== '***') {
                    this.createdEventKey.set(out.eventKey);
                }
                form.patchValue(out);
            },
            afterSaveError: (_error: any, _data: any) => {
                this.basicOverlay.alert('Hata', 'Webhook konfigürasyonu kaydedilemedi.', 'error');
            },
        } as FormEditInstruction<WebhookConfigDTO, WebhookConfigDTO>);
    }

    regenerateEventKey() {
        const id = this.existingId();
        if (!id) return;
        this.basicOverlay
            .confirm(
                'Emin misiniz?',
                'Yeni bir Event Key oluşturulacak ve mevcut key geçersiz olacak. Devam edilsin mi?',
            )
            .subscribe((confirmed) => {
                if (!confirmed) return;
                this.webhookConfigService.regenerateEventKey(id).subscribe({
                    next: (out) => {
                        this.createdEventKey.set(out.eventKey);
                        this.basicOverlay.alert(
                            'general.success',
                            'Yeni Event Key oluşturuldu.',
                            'success',
                        );
                    },
                    error: () => {
                        this.basicOverlay.alert('Hata', 'Event Key oluşturulamadı.', 'error');
                    },
                });
            });
    }

    deleteConfig() {
        const id = this.existingId();
        if (!id) return;
        this.basicOverlay
            .confirm('Emin misiniz?', 'Webhook konfigürasyonunu silmek istediğinize emin misiniz?')
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.webhookConfigService.delete(id).subscribe(() => {
                        this.existingId.set(null);
                        this.createdEventKey.set(null);
                        this.basicOverlay.alert('Silindi', 'Webhook konfigürasyonu silindi.', 'success');
                        this.activatedRoute.params.subscribe((params) => {
                            this.loadConfig(params['accountId']);
                        });
                    });
                }
            });
    }

    copyEventKey() {
        const eventKey = this.createdEventKey();
        if (!this.programmaticCopyEnabled()) {
            this.basicOverlay.alert('Hata', 'Kopyalama yalnızca HTTPS protokolü veya localhost üzerinde desteklenir.', 'error');
            return
        }
        if (eventKey) {
            navigator.clipboard.writeText(eventKey).then(() => {
                this.basicOverlay.alert('general.success', 'Event Key kopyalandı.', 'success');
            });
        }
    }
}
