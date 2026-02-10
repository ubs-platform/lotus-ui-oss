import { PropertyInputType } from './reform/form-input-type';
import { Label } from './label';

export interface RootPropertyMeta<T = any> extends Label {
  /**
   * Name of the property
   * */
  name?: string;

  /**
   * If needed, this will be used for construct a sample and empty instance
   */
  fallbackConstruction?: () => T;
}
