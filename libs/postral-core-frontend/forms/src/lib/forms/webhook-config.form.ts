import { minky, minkyRoot, RegexValidator, RequiredValidator } from '@lotus/front-global/minky/core';
import { WebhookConfigCreateDTO } from '@tk-postral/payment-common';

@minkyRoot()
export class WebhookConfigForm implements WebhookConfigCreateDTO {

    @minky({
        inputType: "slider-toggle",
        label: 'Is Enabled',
    })
    isEnabled: boolean = false;
    @minky({ disable: true })
    accountId: string = '';

    @minky({
        inputType: 'text',
        label: 'Webhook URL',
        validators: [new RequiredValidator(), new RegexValidator(/^https?:\/\/.+$/, "invalid-url")],
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
}
