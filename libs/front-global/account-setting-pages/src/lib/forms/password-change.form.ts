import {
  PasswordLowerLetter,
  MinLength,
  RequiredValidator,
  Samety,
  minky,
  minkyRoot,
  PasswordUpperLetter,
  PasswordSpecialChars,
  PasswordCommons,
  PasswordNumbers,
} from '@lotus/front-global/minky/core';

@minkyRoot({
  fallbackConstruction: () => new PasswordChangeForm(),
})
export class PasswordChangeForm {
  @minky({
    validators: [new RequiredValidator()],
    inputType: 'password',
  })
  currentPassword!: string;

  @minky({
    inputType: 'password',
    validators: [
      new RequiredValidator(),
      new PasswordLowerLetter(),
      new PasswordUpperLetter(),
      new PasswordSpecialChars(),
      new PasswordNumbers(),
      new PasswordCommons(),
      new MinLength(8),
    ],
  })
  newPassword!: string;

  @minky({
    inputType: 'password',
    relatedWithPath: 'newPassword',
    validators: [new RequiredValidator(), new Samety()],
  })
  newPasswordRepeat!: string;
}
