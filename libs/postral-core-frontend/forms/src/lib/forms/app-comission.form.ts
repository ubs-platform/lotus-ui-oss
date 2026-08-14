import { AppComissionDTO } from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { AccountControllerService, ExternalPlatformControllerService } from '@lotus/postral-core-frontend/client';
import { Injector } from '@angular/core';
import { map } from 'rxjs';

@minkyRoot()
export class AppComissionForm extends AppComissionDTO {

  @minky({
    label: 'Dış Platform',
    widthRatio: '50%',
    inputType: "select",
    selectItems: (env) => {
      const externalPlatformService = (env.app?.['injector'] as Injector).get(
        ExternalPlatformControllerService
      );

      return externalPlatformService.findAllSearch(0, 1000, undefined, undefined, undefined).pipe(
        map((response) => {
          return [
            { text: 'Yok', value: undefined },
            ...response.content.map((item) => ({
              text: item.name,
              value: item.id,
            })),
          ];
        })
      );
    }
  })
  override externalPlatformId?: string | undefined;

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

  @minky({
    label: "Sıralama Önceliği",
    widthRatio: '50%',
    disable: true,
  })
  override bias: number = 0;


}
