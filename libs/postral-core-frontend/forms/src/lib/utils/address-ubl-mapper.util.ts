import { AccountAddressDto } from '@tk-postral/payment-common';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { lastValueFrom } from 'rxjs';

export interface AddressUserInputValues {
  countryCodeUserInput: string;
  subdivisionUserInput: string;
  localityUserInput: string;
}

export type AddressUblFields = Pick<
  AccountAddressDto,
  | 'cityCode'
  | 'cityName'
  | 'citySubdivisionName'
  | 'country'
  | 'countryReadName'
  | 'countrySubentity'
  | 'countrySubentityCode'
>;

type AddressUserInput = AddressUserInputValues &
  Pick<AccountAddressDto, 'citySubdivisionName'>;

function matchesValue(
  item: { code?: string; _id?: string; name?: string },
  value: string | undefined
): boolean {
  return !!value && [item.code, item._id, item.name].includes(value);
}

export async function addressFromBackend(
  address: AccountAddressDto,
  cscdService: CscdClientService
): Promise<AddressUserInputValues> {
  const countryCodeUserInput = address.country || '';
  const hasSubdivisions = await lastValueFrom(
    cscdService.hasSubdivisions(countryCodeUserInput)
  );

  return {
    countryCodeUserInput,
    subdivisionUserInput: hasSubdivisions
      ? address.countrySubentityCode || ''
      : address.cityCode || '',
    localityUserInput: hasSubdivisions
      ? address.cityCode || ''
      : address.citySubdivisionName || '',
  };
}

export async function addressToBackend(
  address: AddressUserInput,
  cscdService: CscdClientService
): Promise<AddressUblFields> {
  const countryCode = address.countryCodeUserInput;
  const [countries, hasSubdivisions, subdivisions] = await Promise.all([
    lastValueFrom(cscdService.getCountries()),
    lastValueFrom(cscdService.hasSubdivisions(countryCode)),
    lastValueFrom(cscdService.getSubdivisions(countryCode)),
  ]);
  const country = countries.find((item) => matchesValue(item, countryCode));
  const subdivision = subdivisions.find((item) =>
    matchesValue(item, address.subdivisionUserInput)
  );
  const subdivisionCode =
    subdivision?.code || address.subdivisionUserInput;
  const subdivisionName =
    subdivision?.name || address.subdivisionUserInput;
  const localities = await lastValueFrom(
    cscdService.getLocalities(countryCode, subdivisionCode)
  );
  const locality = localities.find((item) =>
    matchesValue(item, address.localityUserInput)
  );
  const localityCode = locality?.code || address.localityUserInput;
  const localityName = locality?.name || address.localityUserInput;

  return {
    country: country?.code || countryCode,
    countryReadName: country?.name,
    citySubdivisionName: hasSubdivisions
      ? address.citySubdivisionName
      : localityName,
    cityName: hasSubdivisions ? localityName : subdivisionName,
    cityCode: hasSubdivisions ? localityCode : subdivisionCode,
    countrySubentity: hasSubdivisions ? subdivisionName : '',
    countrySubentityCode: hasSubdivisions ? subdivisionCode : '',
  };
}