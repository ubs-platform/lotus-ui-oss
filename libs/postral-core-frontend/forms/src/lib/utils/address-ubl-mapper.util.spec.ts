import { AccountAddressDto } from '@tk-postral/payment-common';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { of } from 'rxjs';
import {
  addressFromBackend,
  addressToBackend,
} from './address-ubl-mapper.util';

describe('address UBL mapper', () => {
  it('maps subdivision-based UBL fields back to form selections', async () => {
    const cscdService = {
      hasSubdivisions: () => of(true),
    } as unknown as CscdClientService;

    await expect(
      addressFromBackend(
        {
          country: 'US',
          countrySubentityCode: 'CA',
          cityCode: 'SFO',
        } as AccountAddressDto,
        cscdService
      )
    ).resolves.toEqual({
      countryCodeUserInput: 'US',
      subdivisionUserInput: 'CA',
      localityUserInput: 'SFO',
    });
  });

  it('maps subdivision countries into their UBL city and subentity fields', async () => {
    const cscdService = {
      getCountries: () => of([{ code: 'US', name: 'United States' }]),
      hasSubdivisions: () => of(true),
      getSubdivisions: () => of([{ code: 'CA', name: 'California' }]),
      getLocalities: () => of([{ code: 'SFO', name: 'San Francisco' }]),
    } as unknown as CscdClientService;

    await expect(
      addressToBackend(
        {
          countryCodeUserInput: 'US',
          subdivisionUserInput: 'CA',
          localityUserInput: 'SFO',
          citySubdivisionName: 'Sunset',
        },
        cscdService
      )
    ).resolves.toEqual({
      country: 'US',
      countryReadName: 'United States',
      citySubdivisionName: 'Sunset',
      cityName: 'San Francisco',
      cityCode: 'SFO',
      countrySubentity: 'California',
      countrySubentityCode: 'CA',
    });
  });

  it('maps countries without subdivisions into city and district fields', async () => {
    const cscdService = {
      getCountries: () => of([{ code: 'TR', name: 'Turkey' }]),
      hasSubdivisions: () => of(false),
      getSubdivisions: () => of([{ code: '34', name: 'İstanbul' }]),
      getLocalities: () => of([{ code: 'Kadikoy', name: 'Kadikoy' }]),
    } as unknown as CscdClientService;

    await expect(
      addressToBackend(
        {
          countryCodeUserInput: 'TR',
          subdivisionUserInput: '34',
          localityUserInput: 'Kadikoy',
          citySubdivisionName: '',
        },
        cscdService
      )
    ).resolves.toEqual({
      country: 'TR',
      countryReadName: 'Turkey',
      citySubdivisionName: 'Kadikoy',
      cityName: 'İstanbul',
      cityCode: '34',
      countrySubentity: '',
      countrySubentityCode: '',
    });
  });
});