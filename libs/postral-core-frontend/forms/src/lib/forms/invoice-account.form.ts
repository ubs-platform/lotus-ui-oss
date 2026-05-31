import { Injector } from '@angular/core';
import { AccountDTO, InvoiceAccountDTO } from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { AddressControllerService } from '@lotus/postral-core-frontend/client';
import { getAccountIdsRelated } from '../utils/get-account-ids-related.util';
import { accountTypes } from '../constants/account-types';

@minkyRoot()
export class InvoiceAccountForm extends InvoiceAccountDTO {
  constructor(private env: any) {
    super();
  }

  @minky({
    disable: true,
  })
  override id = '';

  @minky({
    disable: true,
  })
  override legalIdentity = '';

  @minky({
    disable: true,
  })
  override name = '';

  @minky({ inputType: 'select', selectItems: () => accountTypes })
  override type: 'INDIVIDUAL' | 'COMMERCIAL' = 'COMMERCIAL';
}
