import { UserGeneralInfoDTO } from '@ubs-platform/users-common';
import {
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';
import { LanguageManagement } from '@lotus/front-global/language-management';
@minkyRoot({
  fallbackConstruction: () => new UserGeneralForm(),
})
export class UserGeneralForm implements UserGeneralInfoDTO {
  fromNpmDepency: boolean = false;
  fromLocalLibrary: boolean = false;

  @minky({
    validators: [],
    widthRatio: '50%',
    disable: true,
  })
  username!: string;

  @minky({
    validators: [],
    widthRatio: '50%',
    disable: true,
    label: 'Kullanıcı kimliği',
  })
  id!: string;

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  name!: string;

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  surname!: string;

  @minky({
    inputType: 'select',
    widthRatio: '50%',
    selectItems: () => [
      { text: 'male', value: 'M' },
      { text: 'female', value: 'F' },
      { text: 'walmart-bag', value: 'WALMART_BAG' },
      { text: 'KDE Plasma 5.27 LTS', value: 'KDE_PLASMA_5_27_LTS' },
      {
        text: 'RTX 4080 Ti',
        value: 'RTX_4080_TI',
      },
      {
        text: 'Renault Kangoo 2007 Multix Authentique 1.5 DCi',
        value: 'KANGOO_2007_MULTIX_A_1.5',
      },
      {
        text: 'Volkan Konak',
        value: 'Merhaba ben volkan konak',
      },
      {
        text: 'other',
        value: 'O',
      },
      {
        text: 'i-dont-want-to-tell',
        value: null,
      },
    ],
  })
  gender!: string;

  @minky({
    widthRatio: '50%',
  })
  pronounce!: string;

  @minky({
    widthRatio: '50%',
    inputType: 'array',
    arrayItemInputType: 'text',
    defaultValueConstructor: () => [],
    hide: true,
  })
  webSites!: string[];

  @minky({
    widthRatio: '50%',
    inputType: 'text',
  })
  country!: string;

  @minky({
    inputType: 'text',
    widthRatio: '50%',
  })
  state!: string;

  @minky({
    inputType: 'text',
    widthRatio: '50%',
  })
  city!: string;

  @minky({
    widthRatio: '50%',
  })
  district!: string;

  @minky({
    inputType: 'select',
    selectItems: () => {
      return LanguageManagement.LanguagesSelect;
    },
  })
  localeCode: string = '';
}
