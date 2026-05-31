import {
  PaymentStatus,
  PaymentTransactionSearchDTO,
} from '@tk-postral/payment-common';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { SearchFromStringifiedType } from '../types/search-from-stringified.type';
import { getAccountIdsRelated } from '../utils/get-account-ids-related.util';

@minkyRoot()
export class PaymentTransactionSearchForm
  implements SearchFromStringifiedType<PaymentTransactionSearchDTO>
{
  id?: string | string[] | undefined;
  paymentId?: string | string[] | undefined;
  admin: string | string[] | undefined;

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'select',
    selectItems: () => {
      return [
        { text: 'Tümü', value: '' },
        { text: 'ABD Doları', value: 'USD' },
        { text: 'Euro', value: 'EUR' },
        { text: 'Türk Lirası', value: 'TRY' },
      ];
    },
  })
  currency?: string | undefined;

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'select',
    selectItems: (env) => {
      return getAccountIdsRelated(env, "USER");
    },
    label: 'targetAccountId',
  })
  targetAccountIds: string = '';

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'select',
    selectItems: (env) => {
      return getAccountIdsRelated(env, "SELLER");
    },
    label: 'sourceAccountId',
  })
  sourceAccountIds: string[] = [];

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'datetime',
  })
  dateFrom?: string | undefined;

  @minky({
    defaultValueConstructor: () => '',
    inputType: 'datetime',
  })
  dateTo?: string | undefined;

  @minky({
    defaultValueConstructor: () => [],
    inputType: 'select',
    selectItems: () => {
      return [
        { value: '', text: 'Tümü' },
        { value: 'INITIATED,WAITING', text: 'Bekleyenler' },
        { value: 'COMPLETED', text: 'Tamamlandı' },
        { value: 'FAILED', text: 'Başarısız' },
      ];
    },
  })
  paymentStatus?: PaymentStatus | `${PaymentStatus},${PaymentStatus}` | '' = '';
}
