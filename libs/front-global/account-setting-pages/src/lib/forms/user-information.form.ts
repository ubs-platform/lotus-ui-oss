import { UserGeneralInfoDTO } from '@ubs-platform/users-common';
import {
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';
import { LanguageManagement } from '@lotus/front-global/language-management';
import { Injector } from '@angular/core';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { map } from 'rxjs';
import { fetchCountries, fetchLocalities, fetchSubdivisions, listenSubdivisions, listenLocalities } from "@lotus/front-global/cscd-forms";
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
      { text: 'male', value: 'MALE' },
      { text: 'female', value: 'FEMALE' },
      {
        text: 'other',
        value: 'OTHER',
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
    inputType: "select",
    selectItems: (env) => {
      return fetchCountries(env);
    }
  })
  country!: string;

  @minky({
    inputType: "select",
    widthRatio: '50%',
    selectItems: (env) => {
      return listenSubdivisions(env, () => env.state.formValue.country);
    }
  })
  state!: string;

  @minky({
    inputType: "select",
    widthRatio: '50%',
    selectItems: (env) => {
      return listenLocalities(env, () => env.state.formValue.country, () => env.state.formValue.state);

    }
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
