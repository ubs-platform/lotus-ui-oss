import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';

import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class MinValidator implements Validator {
  labelKey = 'min-value';
  constructor(private intended: number) {}

  validate(value: any): IValidatorResult {
    return new ValidatorResult('value-min', value && value > this.intended);
  }
}

export class MaxValidator implements Validator {
  labelKey = 'max-value';
  constructor(private intended: number) {}

  validate(value: any): IValidatorResult {
    return new ValidatorResult(this.labelKey, value && value < this.intended);
  }
}
