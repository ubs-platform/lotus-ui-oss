import { ItemTaxDTO } from '@tk-postral/payment-common';
import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { ItemTaxVariationForm } from './item-tax-variation.form';

@minkyRoot()
export class ItemTaxForm extends ItemTaxDTO {

  @minky({
    disable: true,
    defaultValueConstructor: () => '',
  })
  override id = '';

  @minky({
    defaultValueConstructor: () => '',
    validators: [new RequiredValidator()],
  })
  override taxName: string = '';

  @minky({
    defaultValueConstructor: () => [],
    inputType: 'array',
    arrayItemInputType: 'sub-object',
    subObjectKey: ItemTaxVariationForm,
  })
  override variations: Array<ItemTaxVariationForm> = [];


  @minky({
    defaultValueConstructor: () => false,
    label: 'Herkese açık',
    inputType: 'checkbox',
  })
  override isPublic: boolean = false;

}
