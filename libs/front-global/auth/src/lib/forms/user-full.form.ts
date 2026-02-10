import { UserFullDto } from '@ubs-platform/users-common';
import {
  MinLength,
  PasswordCommons,
  PasswordLowerLetter,
  PasswordNumbers,
  PasswordSpecialChars,
  PasswordUpperLetter,
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';

@minkyRoot({
  fallbackConstruction: () => new UserFullForm(),
})
export class UserFullForm implements UserFullDto {
  @minky({ disable: true })
  _id?: any;

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
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  username!: string;

  @minky({
    validators: [
      new PasswordLowerLetter(),
      new PasswordUpperLetter(),
      new PasswordSpecialChars(),
      new PasswordNumbers(),
      new PasswordCommons(),
      new MinLength(8),
    ],
    widthRatio: '50%',
    inputType: 'password',
  })
  password!: string;

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  primaryEmail!: string;

  @minky({
    inputType: 'select',
    widthRatio: '50%',
    selectItems: () => {
      
      return [
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
      ];
    },
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
    inputType: 'select',
  })
  country!: string;

  @minky({
    inputType: 'select',
    widthRatio: '50%',
  })
  state!: string;

  @minky({
    inputType: 'select',
    widthRatio: '50%',
  })
  city!: string;

  @minky({
    widthRatio: '50%',
  })
  district!: string;
  @minky({
    inputType: 'checkbox',
  })
  active: boolean = true;

  @minky({
    inputType: 'checkbox',
    widthRatio: '50%',
  })
  suspended: boolean = false;

  @minky({
    widthRatio: '100%',
  })
  suspendReason: string = 'no';

  @minky({
    widthRatio: '100%',
  })
  localeCode: string = '';

  @minky({
    widthRatio: '100%',
    inputType: 'array',
  })
  roles: string[] = [];
}
