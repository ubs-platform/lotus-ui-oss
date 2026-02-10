import { minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot({ fallbackConstruction: () => new AddRestrictionForm() })
export class AddRestrictionForm {
  @minky({ inputType: 'checkbox' })
  endless: boolean = false;

  @minky({ inputType: 'datetime' })
  until: Date = new Date();

  @minky({ inputType: 'text' })
  note: string = '';
}
