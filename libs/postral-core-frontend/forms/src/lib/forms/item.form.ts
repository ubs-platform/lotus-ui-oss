import { Injector } from '@angular/core';
import { ItemDTO, UNIT_TYPES } from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { ItemTaxControllerService } from '@lotus/postral-core-frontend/client';
import { map, min } from 'rxjs';
import { getAccountIdsRelated } from '../utils/get-account-ids-related.util';

@minkyRoot()
export class ItemForm extends ItemDTO {
  @minky({
    disable: true,
    defaultValueConstructor: () => '',
    widthRatio: '50%',
  })
  override id = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
  })
  override name: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
  })
  override entityGroup: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
  })
  override entityName: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '100%',
  })
  override entityId: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
    selectItems: (env) => {
      return UNIT_TYPES;
    },
  })
  override unit: string = '';

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'select',
    widthRatio: '50%',
    selectItems: (env) => {
      return getAccountIdsRelated(env, "USER", "COMMERCIAL");
    },
  })
  override sellerAccountId: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
  })
  override baseCurrency: string = '';

  @minky({
    defaultValueConstructor: () => '',
    widthRatio: '50%',
    inputType: 'select',
    selectItems: () => [
      { text: 'Diğer', value: '' },
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
  override itemClass?: string = '';

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'select',
    widthRatio: '50%',
    selectItems: (env) => {
      const itemTaxService = (env.app?.['injector'] as Injector).get(
        ItemTaxControllerService
      );

      return itemTaxService.getAll().pipe(
        map((a) =>
          a.map((addr) => ({
            value: addr.id!,
            text:
              addr.taxName +
              '(' +
              addr.variations
                .map((v) => v.taxMode + ': ' + v.taxRate + '%')
                .join(', ') +
              ')',
          }))
        )
      );
    },
  })
  override itemTaxId: string = '';
}
