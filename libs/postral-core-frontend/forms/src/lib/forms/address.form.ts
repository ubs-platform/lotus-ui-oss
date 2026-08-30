import { AccountAddressDto } from '@tk-postral/payment-common';
import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { fetchCountries, listenSubdivisions, listenLocalities } from '@lotus/front-global/cscd-forms';


export interface AddressDtoWithUserInput extends AccountAddressDto {
  countryCodeUserInput: string;
  subdivisionUserInput: string;
  localityUserInput: string;
}

@minkyRoot()
export class AddressForm extends AccountAddressDto {
  @minky({
    disable: true,
  })
  override id = undefined;

  @minky({
    validators: [new RequiredValidator()],
  })
  override name = '';


  // Bu alanlar cscd servisi tarafından seçenekler sağlanacak. Seçilen alana göre de diğer ilgili değerler güncellenecek. 
  @minky({
    label: 'Ülke',
    widthRatio: '50%',
    inputType: "select",
    selectItems: (env) => {
      return fetchCountries(env);
    }
  })
  countryCodeUserInput!: string;

  // eyalet ya da şehir
  @minky({
    label: 'Şehir / Eyalet',
    inputType: "select",
    widthRatio: '50%',
    selectItems: (env) => {
      return listenSubdivisions(env, () => env.state.formValue.countryCodeUserInput);
    }
  })
  subdivisionUserInput!: string;

  @minky({
    label: '(Ş) İlçe / (E) İl',
    inputType: "select",
    widthRatio: '50%',
    selectItems: (env) => {
      return listenLocalities(env, () => env.state.formValue.countryCodeUserInput, () => env.state.formValue.subdivisionUserInput);
    }
  })
  localityUserInput!: string;

  @minky({
    label: '(Ş) Rastgele doldurunuz / (E) İlçe',
    validators: [new RequiredValidator()],
    disable: false,
    widthRatio: '50%',

  })
  override citySubdivisionName = '';

  @minky({
    // validators: [new RequiredValidator()],
    disable: true,
    widthRatio: '50%',

  })
  override country = '';
  
  @minky({
    // validators: [new RequiredValidator()],
    disable: true,
    widthRatio: '50%',
    label: "Ülke (okunabilir isim)"
  })
  override countryReadName = '';

  @minky({
    disable: true,
    widthRatio: '50%',
  })
  override countrySubentity?: string | undefined;

  @minky({
    disable: true,
    widthRatio: '50%',

  })
  override countrySubentityCode = '';

  @minky({
    validators: [new RequiredValidator()],
    disable: true,
    widthRatio: '50%',

  })
  override cityName = '';


  @minky({
    validators: [new RequiredValidator()],
  })
  override postalZone = '';

  @minky({
  })
  override streetName = '';

  @minky({
  })
  override buildingNumber = '';

  @minky({
  })
  override blockName = '';

  @minky({
  })
  override floor = '';

  @minky({
  })
  override room = '';


  @minky({
  })
  override postbox = '';

  @minky({
  })
  override buildingName = '';

  @minky({
  })
  override additionalStreetName?: string | undefined;
}
