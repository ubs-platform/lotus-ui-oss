import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class PasswordUpperLetter implements Validator {
  labelKey = 'PasswordUpperLetter';
  constructor() {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      this.labelKey,
      value == null || value == '' || /.*[A-Z].*/g.test(value)
    );
  }
}
