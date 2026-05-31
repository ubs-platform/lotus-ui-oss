import { Injector } from '@angular/core';
import { AccountDTO } from '@tk-postral/payment-common';
import {
  minky,
  minkyRoot,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { AddressControllerService } from '@lotus/postral-core-frontend/client';
import { map } from 'rxjs';
import { CombinedEnvironment } from '@lotus/front-global/minky/core';
import { accountTypes } from '../constants/account-types';

@minkyRoot()
export class AccountForm extends AccountDTO {
  @minky({
    disable: true,
  })
  override id = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override legalIdentity = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override name = '';

  @minky({ inputType: 'select', selectItems: () => accountTypes })
  override type: 'INDIVIDUAL' | 'COMMERCIAL' = 'COMMERCIAL';

  @minky({
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: (env: CombinedEnvironment) => {
      const addressService = (env.app?.['injector'] as Injector).get(
        AddressControllerService
      );
      return addressService
        .getAll()
        .pipe(
          map((a) => a.map((addr) => ({ value: addr.id!, text: addr.name })))
        );
    },
  })
  override defaultAddressId: string = '';

  @minky({
    inputType: 'text',
    label: 'Banka Adı',
    widthRatio: '50%',
    selectItems: () => {
      return [
        { value: 'Vakıf Bank', text: 'Vakıf Bank' },
        { value: 'TC Ziraat Bankası', text: 'TC Ziraat Bankası' },
        { value: 'Halkbank', text: 'Halkbank' },
        { value: 'Denizbank', text: 'Denizbank' },
        { value: 'QNB', text: 'QNB (Finansbank)' },
        { value: 'Yapı Kredi Bankası', text: 'Yapı Kredi Bankası' },
        { value: 'Garanti Bankası', text: 'Garanti Bankası' },
        { value: 'Akbank', text: 'Akbank' },
        { value: 'ING', text: 'ING' },
        { value: 'HSBC', text: 'HSBC' },
      ];
    },
  })
  override bankName = '';

  @minky({
    label: 'IBAN',
    widthRatio: '50%',
  })
  override bankIban = '';

  @minky({
    label: 'BIC kodu',
    widthRatio: '50%',
  })
  override bankBic = '';

  @minky({
    label: 'SWIFT kodu',
    widthRatio: '50%',
  })
  override bankSwift = '';

  @minky({
    label: 'Vergi Dairesi',
  })
  override taxOffice = '';
}
