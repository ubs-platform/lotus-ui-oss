import { ItemPriceDTO } from '@tk-postral/payment-common';
import {
  MinValidator,
  minky,
  minkyRoot,
  RequiredValidator,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class ItemPriceForm implements ItemPriceDTO {
  @minky({
    disable: true,
    defaultValueConstructor: () => '',
  })
  id = '';

  @minky({
    disable: true,
    defaultValueConstructor: () => '',
  })
  itemId = '';

  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
  })
  variation = '';

  @minky({
    defaultValueConstructor: () => 0,
    inputType: 'number',
    validators: [new RequiredValidator(), new MinValidator(0)],
  })
  itemPrice = 0;

  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
  })
  currency = '';

  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
  })
  region = '';

  @minky({
    defaultValueConstructor: () => 0,
    inputType: 'number',
  })
  activityOrder = 0;

  @minky({
    disable: true,
  })
  activeStartAt?: Date | undefined;

  @minky({
    disable: true,
  })
  activeExpireAt?: Date | undefined;

  @minky({
    disable: true,
  })
  automaticExchangeFromCurrency?: string | undefined;
}
