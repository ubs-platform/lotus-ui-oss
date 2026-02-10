import { TranslationKeys } from 'primeng/api';
import { Label } from '../label';
import { PropertyMeta } from '../property-meta';
import { Reform } from './reform';
import { TranslatorText } from '@ubs-platform/translator-core';

export interface IValidatorResult {
  valid: boolean;
  name: TranslatorText;
}

export class ValidatorResult implements IValidatorResult {
  constructor(public name: TranslatorText, public valid: boolean) {}
}

export interface Validator {
  labelKey: string;
  /**
   * Validates the object, it returns ValidatorResult. If it's valid
   * property is true, it is valid. Othervise it is invalid
   * @param value the value will be determined as valid
   */
  validate(value: any, reform?: Reform, meta?: PropertyMeta): IValidatorResult;
}
