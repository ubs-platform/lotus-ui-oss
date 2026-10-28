import { AccountAddressDto } from '@tk-postral/payment-common';
import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { fetchCountries, listenSubdivisions, listenLocalities, fetchIsCountrySubdivision } from '@lotus/front-global/cscd-forms';


export interface AddressDtoWithUserInput extends AccountAddressDto {
  countryCodeUserInput: string;
  subdivisionUserInput: string;
  localityUserInput: string;
}

@minkyRoot()
export class AddressForm extends AccountAddressDto {
  @minky({
    disable: true,
    widthRatio: '50%'
  })
  override id = undefined;

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%'
  })
  override name = '';


  // Bu alanlar cscd servisi tarafından seçenekler sağlanacak. Seçilen alana göre de diğer ilgili değerler güncellenecek. 
  @minky({
    label: 'Ülke',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
    inputType: "select",
    
    selectItems: (env) => {
      return fetchCountries(env);
    },
    emitInitialValueChange: true,
    onValueChange: (value, oldVal, combined) => {
      fetchIsCountrySubdivision(combined, value).subscribe((hasSubdivisions) => {
        // İlçe ayarı eğer subdivision yoksa otomatik doldurulacak şekilde ayarlanıyor. Ancak Subdivision kullanılacaksa kullanıcı tarafından girilmesi gerekiyor. 
        // Popüler bir örnek: ABD (ülke) => Colorado (state/subdivision) => Fairplay (şehir) => SOUTH PARK (ilçe) 
        combined.state.setDisabled?.('citySubdivisionName', !hasSubdivisions);
      });
    },
  })
  countryCodeUserInput!: string;

  // eyalet ya da şehir
  @minky({
    label: 'Şehir / Eyalet',
    inputType: "select",
    widthRatio: '50%',
    selectItems: (env) => {
      return listenSubdivisions(env, () => env.state.formValue.countryCodeUserInput);
    },
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
    label: 'İlçe',
    validators: [new RequiredValidator()],
    disable: false,
    widthRatio: '50%',

  })
  override citySubdivisionName = '';



  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  override postalZone = '';

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  override streetName = '';

  @minky({
    widthRatio: '50%',
  })
  override buildingNumber = '';

  @minky({
    widthRatio: '50%',
  })
  override blockName = '';

  @minky({
    widthRatio: '50%',
  })
  override floor = '';

  @minky({
    widthRatio: '50%',
  })
  override room = '';


  @minky({
    widthRatio: '50%',
  })
  override postbox = '';

  @minky({
    widthRatio: '50%',
  })
  override buildingName = '';

  @minky({
    widthRatio: '50%',
  })
  override additionalStreetName?: string | undefined;


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

}
