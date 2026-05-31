import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { WebhookConfigCreateDTO } from '@tk-postral/payment-common';

@minkyRoot()
export class WebhookConfigForm implements WebhookConfigCreateDTO {
    @minky({ disable: true })
    accountId: string = '';

    @minky({
        inputType: 'text',
        label: 'Webhook URL',
        validators: [new RequiredValidator()],
    })
    url: string = '';

    @minky({
        inputType: 'select',
        label: 'HTTP Metodu',
        validators: [new RequiredValidator()],
        selectItems: () => [
            { value: 'POST', text: 'POST' },
            { value: 'PUT', text: 'PUT' },
        ],
    })
    method: 'POST' | 'PUT' = 'POST';

    @minky({
        inputType: 'text',
        label: 'Event Key (boş bırakılırsa otomatik üretilir)',
    })
    eventKey?: string;
}
