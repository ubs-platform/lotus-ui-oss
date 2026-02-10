import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';

@minkyRoot()
export class PasswordResetInitForm {
  @minky({ validators: [new RequiredValidator()] })
  username!: string;
}
