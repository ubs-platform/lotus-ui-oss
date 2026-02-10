import { PropertyInputType } from './reform/form-input-type';
import { Label } from './label';
import { FeederItem, Validator } from './reform';
import { MetaKey } from './meta-key';
import { CombinedEnvironment, StateEnvironment } from './state-environment';
import { InteropObservable, Observable, ObservableLike } from 'rxjs';


export interface PropertyMeta<T = any> extends Label {
  /**
   * Name of the property
   * */
  name?: string;
  relatedWithPath?: string;
  widthRatio?: string;
  /**
   * Help message for forms
   */
  description?: string;

  /**
   * Determines required input type of the property
   */
  inputType?: PropertyInputType;

  /**
   * If @inputType is provided as array, item type defined in here
   */
  arrayItemInputType?: PropertyInputType;


  /**
   * If object metas of the sub object, can be defined in it and
   * reform renderers extract the object form
   */
  subObjectKey?: MetaKey;

  /**
   * If value is null, it used to construct the new instance
   */
  defaultValueConstructor?: () => T;

  /**
   * Validators of the value
   */
  validators?: Validator[];

  /**
   * hide at the form
   */
  hide?: boolean;

  /**
   * disable at the form
   */
  disable?: boolean;

  selectItems?: (
    appEnv: CombinedEnvironment
  ) => Observable<FeederItem[]> | Promise<FeederItem[]> | FeederItem[];
}
