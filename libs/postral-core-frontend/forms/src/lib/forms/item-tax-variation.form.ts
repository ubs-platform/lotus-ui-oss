import {
  MaxValidator,
  MinValidator,
  minky,
  minkyRoot,
  RequiredValidator,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class ItemTaxVariationForm {
  @minky({
    defaultValueConstructor: () => 'DEFAULT',
  })
  taxMode: string = 'DEFAULT';

  @minky({
    defaultValueConstructor: () => 0,
    inputType: 'number',
    validators: [
      new RequiredValidator(),
      new MaxValidator(100),
      new MinValidator(0),
    ],
  })
  taxRate: number = 0;
}
