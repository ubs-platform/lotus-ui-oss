import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class MinLength implements Validator {
  labelKey = 'MinLength';
  constructor(public length = 8) {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      {
        key: this.labelKey,
        parameters: { length: this.length.toString() },
      },
      value == null || value == '' || value.length >= this.length
    );
  }
}
