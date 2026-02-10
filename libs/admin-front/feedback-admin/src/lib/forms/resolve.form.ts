import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot({
  fallbackConstruction: () => new ResolveForm(),
})
export class ResolveForm {
  @minky({ validators: [new RequiredValidator()] })
  reply: string = '';
}
