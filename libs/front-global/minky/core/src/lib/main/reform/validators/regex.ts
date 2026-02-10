import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class RegexValidator implements Validator {
  labelKey = 'Regex';
  constructor(public regex: RegExp, public customMessage?: string) {}
  validate(value: any, r: Reform, meta: PropertyMeta): IValidatorResult {
    return new ValidatorResult(
      this.customMessage || this.labelKey,
      this.regex.test(value) 
    );
  }
}
