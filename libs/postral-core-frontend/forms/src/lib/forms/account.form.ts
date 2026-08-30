import { Injector } from '@angular/core';
import { AccountDTO, BankAccountDTO } from '@tk-postral/payment-common';
import {
  minky,
  minkyRoot,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { AddressControllerService } from '@lotus/postral-core-frontend/client';
import { map } from 'rxjs';
import { CombinedEnvironment } from '@lotus/front-global/minky/core';
import { accountTypes, currencyOptions } from '../constants/account-types';

@minkyRoot()
export class BankAccountForm extends BankAccountDTO {



  @minky({
    validators: [new RequiredValidator()],
    selectItems: () => currencyOptions,
    widthRatio: '50%',
  })
  override currency?: string | undefined;

  @minky({
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
    }

  })
  override bankName = '';

  @minky({
    label: 'IBAN',
    widthRatio: '50%',
  })
  override bankIban = '';

  @minky({
    label: 'SWIFT kodu',
    widthRatio: '50%',
  })
  override bankSwift?: string | undefined;

  @minky({
    label: 'BIC kodu',
    widthRatio: '50%',
  })
  override bankBic?: string | undefined;

  @minky({
    disable: true,
    widthRatio: '50%',
  })
  override id = undefined;

}

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
    label: 'Vergi Dairesi',
    disable: true,
  })
  override taxOffice = '';

  @minky({
    inputType: "array",
    arrayItemInputType: "sub-object",
    subObjectKey: BankAccountForm,
    label: "Banka Hesapları",
  })
  override bankAccounts: BankAccountDTO[] = [];

  @minky({
    inputType: 'text',
    label: 'Banka Adı (DEPRECATED - Kullanmayınız)',
    widthRatio: '50%',
    disable: true,
  })
  override bankName = '';

  @minky({
    label: 'IBAN (DEPRECATED - Kullanmayınız)',
    widthRatio: '50%',
    disable: true,
  })
  override bankIban = '';

  @minky({
    label: 'BIC kodu (DEPRECATED - Kullanmayınız)',
    widthRatio: '50%',
    disable: true,
  })
  override bankBic = '';

  @minky({
    label: 'SWIFT kodu (DEPRECATED - Kullanmayınız)',
    widthRatio: '50%',
    disable: true,
  })
  override bankSwift = '';

}
