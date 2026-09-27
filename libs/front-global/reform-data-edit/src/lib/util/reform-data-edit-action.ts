import { Signal } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { TranslatorText } from '@lotus/extra/translator-core';
import { Observable } from 'rxjs';

/** Aksiyon durumu sabit, signal, observable veya forma bakan fonksiyon olarak verilebilir */
export type ReformDataEditCondition<INPUT = any> =
  | boolean
  | Signal<boolean>
  | Observable<boolean>
  | ((form: Reform<INPUT>) => boolean);

export interface ReformDataEditAction<INPUT = any> {
  stringContent?: string | TranslatorText;
  iconClass?: string;
  iconContent?: string;
  iconImageSource?: string;
  buttonClass?: string;
  iconPosition?: 'RIGHT' | 'LEFT' | 'NONE';
  hideContentAtLowScr?: boolean;
  disabled?: ReformDataEditCondition<INPUT>;
  renderIf?: ReformDataEditCondition<INPUT>;
  action: (form: Reform<INPUT>) => void;
}
