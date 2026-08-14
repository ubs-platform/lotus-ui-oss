import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import {
  SnapshotAccountDTO,
  SnapshotAddressDTO,
  InvoiceDTO,
  InvoiceSearchDTO,
} from '@tk-postral/payment-common';
import { InvoiceAddressForm } from './invoice-address.form';
import { InvoiceAccountForm } from './invoice-account.form';
@minkyRoot()
export class InvoiceSearchForm implements InvoiceSearchDTO {
  @minky({
    disable: true,
  })
  paymentId?: string | undefined;

  // @minky({
  //   disable: true,
  // })
  // sellerPaymentOrderId?: string | undefined;
  
  // @minky({
  //   disable: true,
  // })
  // invoiceNumber?: string | undefined;
  
  @minky({
    disable: true,
  })
  status?: string | undefined;

  @minky({
    disable: true,
  })
  uploadedByUserId?: string | undefined;

  @minky({
    inputType: 'datetime',
  })
  dateFrom?: Date | undefined;

  @minky({
    inputType: 'datetime',
  })
  dateTo?: Date | undefined;
}
