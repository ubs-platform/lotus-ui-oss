import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class PasswordNumbers implements Validator {
  labelKey = 'PasswordNumbers';
  constructor() {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      this.labelKey,
      value == null || value == '' || /.*[0-9].*/g.test(value)
    );
  }
}
