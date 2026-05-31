import { PaymentChannelConfigDTO } from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot()
export class PaymentChannelConfigForm extends PaymentChannelConfigDTO {
  @minky({
    disable: true,
    widthRatio: '100%',
  })
  override id!: string;

  @minky({
    label: 'Kanal ID',
    widthRatio: '50%',
  })
  override channelId: string = '';

  @minky({
    label: 'Görünen Ad',
    widthRatio: '50%',
  })
  override name: string = '';

  @minky({
    label: 'Açıklama',
    widthRatio: '100%',
    inputType: "text",
  })
  override description?: string | null = null;
  
  @minky({
    label: 'Aktif',
    inputType: 'checkbox',
  })
  override enabled: boolean = true;

  @minky({
    label: 'Sadece Geliştirme ortamında kullan',
    inputType: 'checkbox',
  })
  override devOnly: boolean = false;

}
