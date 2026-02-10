import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslationParameter,
  TranslatorText,
} from '@ubs-platform/translator-core';

@Component({
    selector: 'lotus-web-custom-error-message, lotus-web-custom-message,',
    templateUrl: './custom-error-message.component.html',
    styleUrl: './custom-error-message.component.scss',
    standalone: false
})
export class CustomErrorMessageComponent {
  readonly title = input<TranslatorText>('');
  readonly desc = input<TranslatorText>('');
  readonly imgPath = input<string | undefined>('');
  readonly primeIcons = input<string>();
}
