import {
  TranslationParameter,
  TranslatorText,
} from '@lotus/extra/translator-core';

export class MessageInput {
  constructor(
    public type: 'error' | 'success' | 'info' | 'warn',
    public title: TranslatorText,
    public description: TranslatorText
  ) {}
}
