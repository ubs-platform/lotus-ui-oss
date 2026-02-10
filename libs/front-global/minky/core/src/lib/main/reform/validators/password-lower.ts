import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class PasswordLowerLetter implements Validator {
  labelKey = 'PasswordLowerLetter';
  constructor() {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      this.labelKey,
      value == null || value == '' || /.*[a-z].*/g.test(value)
    );
  }
}
