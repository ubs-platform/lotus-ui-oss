import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import {
  InvoiceAccountDTO,
  InvoiceAddressDto,
  InvoiceDTO,
} from '@tk-postral/payment-common';
import { InvoiceAddressForm } from './invoice-address.form';
import { InvoiceAccountForm } from './invoice-account.form';
@minkyRoot()
export class InvoiceForm implements InvoiceDTO {
  @minky({
    disable: true,
  })
  id: string = '';

  @minky({
    disable: true,
  })
  finalized = false

  @minky({
    disable: true,
  })
  paymentId: string = '';
  @minky({
    disable: true,
  })
  sellerPaymentOrderId: string = '';
  @minky({
    disable: true,
  })
  invoiceNumber?: string | undefined;
  @minky({
    disable: true,
  })
  invoiceDate?: Date | undefined;
  @minky({
    disable: true,
  })
  status: string = '';
  @minky({
    disable: true,
  })
  uploadedByUserId?: string | undefined;
  @minky({
    inputType: 'text',
  })
  notes?: string | undefined;
  @minky({
    disable: true,
  })
  createdAt: Date = new Date();

  @minky({
    disable: true,
  })
  updatedAt: Date = new Date();
  @minky({
    inputType: 'sub-object',
    subObjectKey: InvoiceAddressForm,
  })
  sellerInvoiceAddress?: InvoiceAddressDto | undefined;
  @minky({
    inputType: 'sub-object',
    subObjectKey: InvoiceAccountForm,
  })
  sellerInvoiceAccount?: InvoiceAccountDTO | undefined;
  @minky({
    inputType: 'sub-object',
    subObjectKey: InvoiceAddressForm,
  })
  customerInvoiceAddress?: InvoiceAddressDto | undefined;

  @minky({
    inputType: 'sub-object',
    subObjectKey: InvoiceAccountForm,
  })
  customerAccount?: InvoiceAccountDTO | undefined;
}
