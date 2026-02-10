import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';
import { RegexValidator } from './regex';

export class EmailValidator extends RegexValidator {
  constructor() {
    super(/^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'email-format');
  }

  override validate(
    value: any,
    r: Reform,
    meta: PropertyMeta
  ): IValidatorResult {
    return super.validate(value, r, meta);
  }
}
