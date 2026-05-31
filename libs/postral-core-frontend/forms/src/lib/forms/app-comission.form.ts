import { AppComissionDTO } from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot()
export class AppComissionForm extends AppComissionDTO {
  @minky({
    disable: true,
    widthRatio: '50%',
  })
  override id = '';

  @minky({
    label: 'Satıcı Hesap ID',
    widthRatio: '50%',
  })
  override sellerAccountId?: string = undefined;

  @minky({
    label: 'Ürün Sınıfı',
    widthRatio: '50%',
    selectItems: () => [
        { text: 'Varsayılan', value: '' },
        { text: 'Elektronik', value: 'electronics' },
        { text: 'Giyim', value: 'clothing' },
        { text: 'Ev & Yaşam', value: 'home_living' },
        { text: 'Spor & Outdoor', value: 'sports_outdoor' },
        { text: 'Otomotiv', value: 'automotive' },
        { text: 'Kitap & Medya', value: 'books_media' },
        { text: 'Sağlık & Güzellik', value: 'health_beauty' },
        { text: 'Oyuncak', value: 'toys' },
    ],
  })
  override itemClass?: string = undefined;

  @minky({
    label: 'Komisyon Oranı (%)',
    widthRatio: '50%',
    inputType: 'number',
  })
  override percent: number = 0;
}
