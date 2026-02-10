import { UserDTO, UserRegisterDTO } from '@ubs-platform/users-common';
import {
  EmailValidator,
  MaxLengthValidator,
  MinLength,
  MinLengthValidator,
  PasswordCommons,
  PasswordLowerLetter,
  PasswordNumbers,
  PasswordSpecialChars,
  PasswordUpperLetter,
  RegexValidator,
  RequiredValidator,
  Samety,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class RegistrationForm implements UserRegisterDTO {
  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  name!: string;

  @minky({
    hide: true,
  })
  registerId!: string;

  @minky({
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  surname!: string;

  @minky({
    validators: [
      new RequiredValidator(),
      new RegexValidator(/^[a-zA-Z][a-zA-Z0-9._]*$/, 'username-regex'),
      new MaxLengthValidator(15),
      new MinLengthValidator(2),
    ],
  })
  username!: string;
  @minky({
    validators: [new RequiredValidator(), new EmailValidator()],
  })
  primaryEmail!: string;

  @minky({
    inputType: 'password',
    validators: [
      new RequiredValidator(),
      new PasswordLowerLetter(),
      new PasswordUpperLetter(),
      new PasswordSpecialChars(),
      new PasswordNumbers(),
      // new PasswordCommons(),
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

  @minky({
    hide: true,
  })
  localeCode: string = '';
}
