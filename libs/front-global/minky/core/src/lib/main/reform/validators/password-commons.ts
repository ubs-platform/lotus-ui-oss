import { PropertyMeta } from '../../property-meta';
import { Reform } from '../reform';
import { Validator, IValidatorResult, ValidatorResult } from '../validator';

export class PasswordCommons implements Validator {
  labelKey = 'PasswordCommons';

  constructor() {}
  validate(value: string, r: Reform, meta: PropertyMeta): IValidatorResult {
    const v = value?.toLowerCase() || '';
    return new ValidatorResult(
      this.labelKey,
      value == null ||
        value == '' ||
        !(
          v.includes('password') ||
          v.includes('admin') ||
          v.includes('root') ||
          v.includes('parola') ||
          v.includes('şifre') ||
          v.includes('1907') ||
          v.includes('fenerbahçe') ||
          v.includes('fenerbahce') ||
          v.includes('1903') ||
          v.includes('besiktas') ||
          v.includes('beşiktaş') ||
          v.includes('1905') ||
          v.includes('galatasaray') ||
          v.includes('1234567') ||
          v.includes('123456') ||
          v.includes('12345') ||
          v.includes('1234')
        )
    );
  }
}
