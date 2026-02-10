import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';

import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class MinLengthValidator implements Validator {
  labelKey = 'min-length';
  constructor(private intended: number) {}

  validate(value: string): IValidatorResult {
    const length = value?.length;
    const bl = length >= this.intended;
    return new ValidatorResult(
      {
        key: this.labelKey,
        parameters: { intended: this.intended.toString() },
      },
      bl
    );
  }
}

export class MaxLengthValidator implements Validator {
  labelKey = 'max-length';
  constructor(private intended: number) {}

  validate(value: string): IValidatorResult {
    const length = value?.length;
    const bl = length <= this.intended;
    return new ValidatorResult(
      {
        key: this.labelKey,
        parameters: { intended: this.intended.toString() },
      },
      bl
    );
  }
}
