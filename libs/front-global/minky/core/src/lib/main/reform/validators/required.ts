import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class RequiredValidator implements Validator {
  labelKey = 'RequiredValidator';
  validate(value: any): IValidatorResult {
    return new ValidatorResult(
      this.labelKey,
      value != null && (value.toString() as string).trim() != ''
    );
  }
}
