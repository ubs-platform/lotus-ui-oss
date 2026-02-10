import {
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewChildren,
  input
} from '@angular/core';
import { IIcon } from '@lotus/front-global/icon-type';
import {
  TranslationParameter,
  TranslatorText,
} from '@ubs-platform/translator-core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'block-button',
    templateUrl: './b-button.component.html',
    styleUrls: ['./b-button.component.scss'],
    standalone: false
})
export class BButtonComponent {
  readonly iconClass = input('');
  readonly iconContent = input('');
  readonly iconImageSource = input('');
  readonly buttonClass = input('surface');

  readonly growRight = input(false);
  readonly growLeft = input(false);
  readonly disabled = input(false);
  readonly cover = input(false);
  readonly iconPosition = input<'RIGHT' | 'LEFT' | 'NONE'>('LEFT');
  readonly btnTabindex = input<string>();
  readonly hasContent = input(true);
  readonly stringContent = input<string | TranslatorText>();
  readonly hideContentAtLowScr = input(false);
  readonly contentClass = input('');
  contentClassSys = '';
}
