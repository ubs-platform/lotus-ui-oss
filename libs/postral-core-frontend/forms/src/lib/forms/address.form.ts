import { AccountAddressDto } from '@tk-postral/payment-common';
import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';

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

  @minky({
    validators: [new RequiredValidator()],
  })
  override country = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override cityName = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override citySubdivisionName = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override postalZone = '';

  @minky({
    validators: [new RequiredValidator()],
  })
  override streetName = '';
}
