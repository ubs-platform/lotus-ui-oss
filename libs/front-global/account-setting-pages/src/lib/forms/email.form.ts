import { UserGeneralInfoDTO } from '@ubs-platform/users-common';
import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';
@minkyRoot({
  fallbackConstruction: () => new EmailForm(),
})
export class EmailForm {
  @minky({
    validators: [new RequiredValidator()],
    label: 'new-email',
  })
  email!: string;
}
