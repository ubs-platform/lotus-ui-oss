import { PropertyMeta } from '../property-meta';
import { Reform } from './reform';
import { TranslatorText } from '@lotus/extra/translator-core';

export interface IValidatorResult {
  valid: boolean;
  name: TranslatorText;
}

/**
 * Non-blocking field message levels. Unlike validation errors, they never
 * affect `hasErrors()`.
 */
export type ReformMessageSeverity = 'warning' | 'info';

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
