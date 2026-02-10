import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class Samety implements Validator {
  labelKey = 'Samety';
  constructor() {}
  validate(value: any, r: Reform, meta: PropertyMeta): IValidatorResult {
    if (meta?.relatedWithPath) {
      return new ValidatorResult(
        this.labelKey,
        r.getValueByPath(meta.relatedWithPath) == value
      );
    } else {
      return new ValidatorResult(this.labelKey, true);
    }
  }
}
