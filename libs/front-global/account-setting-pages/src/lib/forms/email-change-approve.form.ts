import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot({
  fallbackConstruction: () => new EmailChangeApproveForm(),
})
export class EmailChangeApproveForm {
  @minky({
    label: 'validation-code',
    validators: [new RequiredValidator()],
  })
  code!: string;
}
