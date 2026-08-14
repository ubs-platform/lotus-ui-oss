import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { SnapshotAddressDTO } from '@tk-postral/payment-common';
@minkyRoot()
export class InvoiceAddressForm extends SnapshotAddressDTO {
  @minky({
    disable: true,
  })
  override id?: string = '';
  @minky({
    disable: true,
  })
  override name: string = '';
  @minky({
    disable: true,
  })
  override entityOwnershipGroupId?: string = '';
  @minky({
    disable: true,
  })
  override buildingNumber?: string = '';

  @minky({
    disable: true,
  })
  override buildingName?: string = '';

  @minky({
    disable: true,
  })
  override room?: string = '';

  @minky({
    disable: true,
  })
  override floor?: string = '';
  @minky({
    disable: true,
  })
  override blockName?: string = '';
  @minky({
    disable: true,
  })
  override streetName: string = '';
  @minky({
    disable: true,
  })
  override additionalStreetName?: string = '';
  @minky({
    disable: true,
  })
  override district?: string = '';
  @minky({
    disable: true,
  })
  override citySubdivisionName: string = '';
  @minky({
    disable: true,
  })
  override cityName: string = '';
  @minky({
    disable: true,
  })
  override postalZone: string = '';
  @minky({
    disable: true,
  })
  @minky({
    disable: true,
  })
  override region?: string;
  @minky({
    disable: true,
  })
  override postbox?: string;
  @minky({
    disable: true,
  })
  override country: string = '';
  @minky({
    disable: true,
  })
  override countrySubentity?: string;
  @minky({
    disable: true,
  })
  override countrySubentityCode?: string;
  @minky({
    disable: true,
  })
  override addressFormatCode?: string;
  @minky({
    disable: true,
  })
  override addressTypeCode?: string;
  @minky({
    disable: true,
  })
  override department?: string;
  @minky({
    disable: true,
  })
  override markAttention?: string;
  @minky({
    disable: true,
  })
  override markCare?: string;
  @minky({
    disable: true,
  })
  override plotIdentification?: string;
  @minky({
    disable: true,
  })
  override cityCode?: string;
  @minky({
    disable: true,
  })
  override inhaleName?: string;
  
  @minky({
    disable: true,
  })
  override timezone?: string;
}
