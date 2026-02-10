import {
  TranslationParameter,
  TranslatorText,
} from '@ubs-platform/translator-core';

export class LoadingData {
  constructor(
    public name: string,
    public show: boolean,
    public title?: TranslatorText,
    public progressValue?: number | null | undefined
  ) {}
}
