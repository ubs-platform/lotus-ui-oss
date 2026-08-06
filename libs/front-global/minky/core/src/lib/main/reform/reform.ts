import { MetaKey } from '../meta-key';
import { getStructureRootMetaHolder } from '../parental-holder';
import { PropertyMeta } from '../property-meta';
import { getPropertyMetaHolder, PropertyMetaHolder } from '../property-holder';
import { RootPropertyMeta } from '../root-property-meta';
import { InputLinkCarrier } from './carriers/input-link-carrier';
import { Reviewer } from './reviewer';
import { IValidatorResult, ValidatorResult } from './validator';
import { ReplaySubject, Subject } from 'rxjs';
import { TouchMap } from './touch-map';
import {
  DefaultEnvironmentControl,
  IEnvironmentControl,
} from './environment-control';
import { ReformUtils } from './utils';
import { MetaPath } from './metapath';
import { CarrierManager } from './carriers/carrier-manager';
import { ListFunction } from './select-feeder';
import {
  ApplicationEnvironment,
  CombinedEnvironment,
} from '../state-environment';

export class Reform<T = any> {
  propertyMetas: PropertyMeta<T>[];
  structureRootMeta?: RootPropertyMeta<T>;
  private _value: any;
  private _initialValue: any;
  valueUpdate = new Subject<T>();
  valueBigUpdate = new Subject<T>();
  touchMap = new TouchMap();
  allErrorsRevealed: boolean = false;
  carrierManager: CarrierManager<T>;
  fileMap: Map<string, File[]> = new Map();
  appEnv?: ApplicationEnvironment;
  private _parameters = new Map<string, any>();

  constructor(
    private metaKey: MetaKey,
    baseObject?: T,
    private environmentControl?: IEnvironmentControl
  ) {
    if (!environmentControl)
      environmentControl = new DefaultEnvironmentControl();
    this.propertyMetas = getPropertyMetaHolder().getMetas(metaKey);
    this.structureRootMeta = getStructureRootMetaHolder().getMetas(metaKey);
    if (this.structureRootMeta?.fallbackConstruction && baseObject == null) {
      this._value = this.structureRootMeta.fallbackConstruction();
    } else if (baseObject != null) {
      this._value = baseObject;
    } else {
      throw `MINKY REFORM: unable to find related structural meta ${metaKey} with 'fallbackConstruction', it is required for construct baseObject properly`;
    }

    this._initialValue = JSON.parse(JSON.stringify(this._value));

    this.carrierManager = new CarrierManager({
      getValueByPath: (p) => this.getValueByPath(p),
      setValueByPath: (p, value) => this.setValueByPath(p, value),
      emitBigUpdate: (va) => this.valueBigUpdate.next(va),
      validationErrorByPath: (path) => this.validationErrorByPath(path),
      currentPropertyMetas: () => this.propertyMetas,
      touchMap: () => this.touchMap,
      value: () => this.value,
      emitUpdate: (val) => this.valueUpdate.next(val),
      setFileByPath: (p, file) => this.setFileByPath(p, file),
      getFeeder: (path) => {
        const meta = this.getPropertyMeta(path);
        if (meta && typeof meta.selectItems === 'function') {
          return () =>
            meta.selectItems?.({
              app: this.appEnv,
              parameters: this._parameters,
              state: { formValue: this._value },
            }) || [];
        }
        console.warn('MINKY: Unable to find related meta for select items');
        return () => [];
      },
      combinedEnvironment: () => ({
        app: this.appEnv,
        parameters: this._parameters,
        state: { formValue: this._value },
      }),
    });
  }

  patchValue(value: Partial<T>) {
    for (const key of Object.keys(value)) {
      this.setValueByPath(key, (value as any)[key]);
    }
    this.valueBigUpdate.next(this.value);
  }

  getParameterMap() {
    return this._parameters;
  }


  setApplicationEnvironment(appEnv: ApplicationEnvironment) {
    this.appEnv = appEnv;
  }

  get value(): T {
    return this._value as T;
  }

  get initialValue(): T {
    return this._initialValue as T;
  }

  buildPath(...arg0: Array<string | number | null | undefined>) {
    return ReformUtils.buildPath(...arg0);
  }

  destructPath(path: string) {
    return path.split('.');
  }

  getPropertyMeta(path: string): any {
    const keys = this.destructPath(path);
    let relatedMeta: PropertyMeta | undefined;
    let currentPropertyMeta = this.propertyMetas;
    let arrayStage = 0;

    for (const key of keys) {
      if (arrayStage !== 1) {
        relatedMeta = currentPropertyMeta.find((a) => a.name === key);
      }
      if (!relatedMeta) {
        console.warn('MINKY: Unable to reach related meta');
        break;
      }
      arrayStage = this.decideArrayChange(relatedMeta, arrayStage);
      if (relatedMeta.subObjectKey && arrayStage !== 1) {
        currentPropertyMeta = getPropertyMetaHolder().getMetas(relatedMeta.subObjectKey);
      }
    }
    return relatedMeta;
  }

  getValueByPath(path: string): any {
    const keys = this.destructPath(path);
    let currentValue: any = this.value;
    let relatedMeta: PropertyMeta | undefined;
    let currentPropertyMeta = this.propertyMetas;
    let arrayStage = 0;

    for (const key of keys) {
      if (arrayStage !== 1) {
        relatedMeta = currentPropertyMeta.find((a) => a.name === key);
      }
      if (!relatedMeta) {
        console.warn('MINKY: Unable to reach related meta');
        break;
      }
      currentValue = this.nullSafeValueGetter(currentValue, key, arrayStage === 1, relatedMeta);
      arrayStage = this.decideArrayChange(relatedMeta, arrayStage);
      if (relatedMeta.subObjectKey && arrayStage !== 1) {
        currentPropertyMeta = getPropertyMetaHolder().getMetas(relatedMeta.subObjectKey);
      }
    }
    return currentValue;
  }

  initializeValueByPath(path: string): void {}

  setValueByPath(path: string, value: any): void {
    const keys = this.destructPath(path);
    if (keys.length === 1) {
      // @ts-ignore
      this.value[keys[0] as string] = value;
    } else {
      const parent = this.getValueByPath(this.buildPath(...keys.slice(0, -1)));
      parent[keys[keys.length - 1]] = value;
    }
    this.valueUpdate.next(this.value);
  }

  setFileByPath(path: string, file: File[]): void {
    this.fileMap.set(path, file);
  }

  getFiles() {
    return Array.from(this.fileMap, ([key, files]) => ({ key, files }));
  }

  private decideArrayChange(relatedMeta: PropertyMeta<any> | undefined, stage: number): number {
    if (relatedMeta?.inputType !== 'array') return 0;
    return stage === 0 ? 1 : stage === 1 ? 2 : 1;
  }

  private nullSafeValueGetter(
    parentObject: any,
    key: string,
    excludeArray: boolean,
    keyPropertyMeta?: PropertyMeta<T>
  ) {
    const childObject = this.tryToTurnNonNullIfIt(parentObject[key], keyPropertyMeta, excludeArray);
    parentObject[key] = childObject;
    return childObject;
  }

  private tryToTurnNonNullIfIt(
    childObject: any,
    keyPropertyMeta: PropertyMeta<T> | undefined,
    excludeArray: boolean
  ) {
    if (childObject != null) return childObject;
    if (!excludeArray && keyPropertyMeta?.inputType === 'array') return [];
    if (keyPropertyMeta?.inputType === 'checkbox') return false;
    if (keyPropertyMeta?.inputType === 'number') return 0;
    if (keyPropertyMeta?.inputType === 'text') return '';
    if (keyPropertyMeta?.defaultValueConstructor) return keyPropertyMeta.defaultValueConstructor();
    if (keyPropertyMeta?.subObjectKey) {
      const rootMeta = getStructureRootMetaHolder().getMetas(keyPropertyMeta.subObjectKey);
      if (rootMeta?.fallbackConstruction) return rootMeta.fallbackConstruction();
    }
    return childObject;
  }

  getAllMetasPaths(propertyMetas = this.propertyMetas, prefix = ''): MetaPath[] {
    const metapaths: MetaPath[] = [];
    for (const propertyMeta of propertyMetas) {
      const path = this.buildPath(prefix, propertyMeta.name);
      if (propertyMeta.inputType === 'array') {
        const length = (this.getValueByPath(path) as Array<any>).length;
        for (let arrayIndex = 0; arrayIndex < length; arrayIndex++) {
          if (propertyMeta.subObjectKey) {
            metapaths.push(...this.subObjectMetaPaths(propertyMeta, this.buildPath(path, arrayIndex)));
          } else {
            metapaths.push({ meta: propertyMeta, path });
          }
        }
      } else if (propertyMeta.subObjectKey) {
        metapaths.push(...this.subObjectMetaPaths(propertyMeta, path));
      } else if (propertyMeta.name) {
        metapaths.push({ meta: propertyMeta, path });
      }
    }
    return metapaths;
  }

  hasErrors() {
    return this.allValidationErrors().length > 0;
  }

  allValidationErrors() {
    //@ts-ignore işim gücüm yok bir de bin tane tsconfig'te lib'leri ayarlayacağım. hay amk ya
    return this.getAllMetasPaths().flatMap((path) => this.validationErrorByPath(path));
  }

  validationErrorByPath(path: MetaPath) {
    const value = path.meta.inputType === 'file'
      ? this.getFiles().find((a) => a.key === path.path)?.files[0]
      : this.getValueByPath(path.path);
    const validations: ValidatorResult[] = [];
    path.meta.validators?.forEach((validator) => {
      const result = validator.validate(value, this, path.meta);
      if (!result.valid) validations.push(result);
    });
    return validations;
  }

  subObjectMetaPaths(propertyMeta: PropertyMeta<T>, path: string) {
    const keyPropMeta = getPropertyMetaHolder().getMetas(
      propertyMeta.subObjectKey
    );
    if (keyPropMeta) {
      return this.getAllMetasPaths(keyPropMeta, path);
    }
    return [];
  }

  revealAllErrors() {
    this.allErrorsRevealed = true;
  }

  reset() {
    this._value = JSON.parse(JSON.stringify(this._initialValue));
    this.fileMap.clear();
    this.touchMap = new TouchMap();
    this.allErrorsRevealed = false;
    this.valueBigUpdate.next(this.value);
  }

  resetToValue(value: T) {
    this._initialValue = JSON.parse(JSON.stringify(value));
    this.reset();
  }

  generateInputCarriers(propertyMetas = this.propertyMetas, prefix = '') {
    return this.carrierManager.generateInputCarriers(propertyMetas, prefix);
  }
}
