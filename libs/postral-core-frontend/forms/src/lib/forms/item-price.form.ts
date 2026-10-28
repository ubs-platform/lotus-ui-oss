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
    widthRatio: '50%',
  })
  itemId = '';

  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  variation = '';
  
  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  currency = '';

  @minky({
    defaultValueConstructor: () => 0,
    inputType: 'number',
    validators: [new RequiredValidator(), new MinValidator(0)],
    widthRatio: '50%',
  })
  itemPrice = 0;



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
