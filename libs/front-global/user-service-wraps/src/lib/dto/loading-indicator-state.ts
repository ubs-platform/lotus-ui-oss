import { TranslatorText } from '@ubs-platform/translator-core';

export class LoadingIndicatorState {
  constructor(
    public show: boolean,
    public title?: TranslatorText,
    public progressValue: number | null | undefined = undefined
  ) {}
}
