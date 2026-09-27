import {
  TranslationParameter,
  TranslatorText,
} from '@lotus/extra/translator-core';

export class LoadingData {
  constructor(
    public name: string,
    public show: boolean,
    public title?: TranslatorText,
    public progressValue?: number | null | undefined
  ) {}
}
