import { TemplateRef } from '@angular/core';
import { TranslatorText } from '@ubs-platform/translator-core';

export interface InstantModalOptions {
  templateRef?: TemplateRef<any>;
  url?: string;
  height?: string;
  width?: string;
  header?: boolean;
  htmlContentUrl?: string;
  htmlContent?: string;
  noButtonText?: TranslatorText;
  yesButtonText?: TranslatorText;
}
