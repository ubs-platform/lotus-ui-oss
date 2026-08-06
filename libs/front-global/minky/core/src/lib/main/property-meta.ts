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

  /**
   * If true, user can add and remove items in the array input type
   */
  allowUserAddAndRemoveItem?: boolean;

  selectItems?: (
    appEnv: CombinedEnvironment
  ) => Observable<FeederItem[]> | Promise<FeederItem[]> | FeederItem[];

  /**
   * Callback function invoked when the value changes
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   * @param appEnv The combined application environment
   * @param stateEnv The state environment
   * @returns The result of the value change handler, can be a promise or any value. If it is not undefined or void, the new value will be replaced with the returned value.
   */
  onValueChange?: (
    newValue: T,
    oldValue: T,
    combinedEnvironment: CombinedEnvironment,
    // appEnv: CombinedEnvironment,
    // stateEnv: StateEnvironment
  ) => T | undefined ;
}
