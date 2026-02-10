import { Observable } from 'rxjs';
import { PropertyMeta } from '../../property-meta';
import { MetaPath } from '../metapath';
import { ListFunction } from '../select-feeder';
import { TouchMap } from '../touch-map';
import { IValidatorResult } from '../validator';
import { CombinedEnvironment } from '../../state-environment';

export interface ICarrierBridge {
  currentPropertyMetas(): PropertyMeta[];
  touchMap(): TouchMap;
  setValueByPath(path: string, value: any): void;
  setFileByPath(path: string, value: any): void;
  getValueByPath(path: string): any;
  validationErrorByPath(path: MetaPath): IValidatorResult[];
  emitBigUpdate(val: any): void;
  emitUpdate(val: any): void;
  value(): any;
  getFeeder(path: string): ListFunction;
}
