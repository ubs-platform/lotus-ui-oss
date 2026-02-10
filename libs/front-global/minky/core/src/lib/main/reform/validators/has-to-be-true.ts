import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class HasToBeTrueValidator implements Validator {
  labelKey = 'HasToBeTrueValidator';
  validate(value: any): IValidatorResult {
    return new ValidatorResult(this.labelKey, value == true);
  }
}
