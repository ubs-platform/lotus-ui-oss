import {
  MinLength,
  PasswordCommons,
  PasswordLowerLetter,
  PasswordNumbers,
  PasswordSpecialChars,
  PasswordUpperLetter,
  RequiredValidator,
  Samety,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class PasswordResetSecondForm {
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
    widthRatio: '50%',
  })
  password!: string;

  @minky({
    inputType: 'password',
    relatedWithPath: 'password',
    validators: [new RequiredValidator(), new Samety()],
    widthRatio: '50%',
  })
  passwordRepeat!: string;
}
