import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class PasswordSpecialChars implements Validator {
  labelKey = 'PasswordSpecialChars';
  constructor() {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      this.labelKey,
      value == null ||
        value == '' ||
        /.*[!@#\$%\^\&*\)\<\>\(+=._-].*/g.test(value)
    );
  }
}
