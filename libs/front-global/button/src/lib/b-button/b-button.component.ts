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
} from '@lotus/extra/translator-core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'block-button',
  templateUrl: './b-button.component.html',
  styleUrls: ['./b-button.component.scss'],
  standalone: false
})
export class BButtonComponent {
  // material-symbols-outlined
  readonly iconClass = input<string | null | undefined>(undefined);
  readonly iconContent = input<string | null | undefined>(undefined);
  readonly iconImageSource = input<string | null | undefined>(undefined);
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
  readonly contentClass = input<string | undefined>(undefined);
  readonly pTooltip = input<string | TranslatorText | undefined>(undefined);
  contentClassSys = '';
}
