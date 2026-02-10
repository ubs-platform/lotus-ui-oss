import { TranslatorText } from '@ubs-platform/translator-core';

export interface IWebDialogConfig<INPUT_DATA, OUT_VALUE> {
  position?:
    | 'center'
    | 'right'
    | 'left'
    | 'bottom-center'
    | 'bottom-right'
    | 'bottom-left';
  title?: TranslatorText;
  displayHeader?: boolean;
  dissmissOnClickMask?: boolean;
  displayCloseButton?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  width?: string;
  height?: string;
  data?: INPUT_DATA;
  defaultOutValue: OUT_VALUE;
  padding?: boolean;
}
