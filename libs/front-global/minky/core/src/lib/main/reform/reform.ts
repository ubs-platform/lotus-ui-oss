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
  // revert ReplaySubject back when any error
  valueUpdate = new Subject<T>();
  // revert ReplaySubject back when any error
  valueBigUpdate = new Subject<T>();
  touchMap = new TouchMap();
  allErrorsRevealed: boolean = false;
  carrierManager: CarrierManager<T>;
  fileMap: Map<string, File[]> = new Map();
  appEnv?: ApplicationEnvironment;
  private _parameters = new Map<string, any>();

  // private selectFeeders: Map<string, ListFunction> = new Map();


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

    // Store initial value as deep copy
    this._initialValue = JSON.parse(JSON.stringify(this._value));

    this.carrierManager = new CarrierManager({
      getValueByPath: (p) => this.getValueByPath(p),
      setValueByPath: (p, value) => this.setValueByPath(p, value),
      emitBigUpdate: (va) => this.valueBigUpdate.next(va),
      validationErrorByPath: (path) => this.validationErrorByPath(path),
      currentPropertyMetas: () => this.propertyMetas,
      touchMap: () => this.touchMap,
      value: () => this.value,
      emitUpdate: (val) => {
        this.valueUpdate.next(val);
      },
      setFileByPath: (p, file) => this.setFileByPath(p, file),
      getFeeder: (path) => {

        const meta = this.getPropertyMeta(path);
        if (meta && typeof meta.selectItems === 'function') {
          return () =>
            meta.selectItems?.({
              app: this.appEnv,
              parameters: this._parameters,
              state: {
                formValue: this._value,
              },
            }) || [];
        }
        console.warn('MINKY: Unable to find related meta for select items');
        return () => [];
      },
    });
  }

  patchValue(value: Partial<T>) {
    Object.keys(value).forEach((key) => {
      this.setValueByPath(key, (value as any)[key]);
    });
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
    let currentRootMeta = this.structureRootMeta;

    let arrayStage: number = 0;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (arrayStage != 1) {
        relatedMeta = currentPropertyMeta.find((a) => a.name == key);
      }

      if (!relatedMeta) {
        console.warn('MINKY: Unable to reach related meta');
        break;
      }
      arrayStage = this.decideArrayChange(relatedMeta, arrayStage);

      //after operation, if there is nested a object, meta gonna be changed
      if (relatedMeta.subObjectKey) {
        if (arrayStage != 1) {
          currentPropertyMeta = getPropertyMetaHolder().getMetas(
            relatedMeta.subObjectKey
          );
          currentRootMeta = getStructureRootMetaHolder().getMetas(
            relatedMeta.subObjectKey
          );
        }
      }
    }
    return relatedMeta;
  }

  getValueByPath(path: string): any {
    const keys = this.destructPath(path);
    let currentValue: any = this.value;
    let relatedMeta: PropertyMeta | undefined;
    let currentPropertyMeta = this.propertyMetas;
    let currentRootMeta = this.structureRootMeta;

    let arrayStage: number = 0;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (arrayStage != 1) {
        relatedMeta = currentPropertyMeta.find((a) => a.name == key);
      }

      if (relatedMeta) {
        currentValue = this.nullSafeValueGetter(
          currentValue,
          key,
          arrayStage == 1,
          relatedMeta
        );
      } else {
        console.warn('MINKY: Unable to reach related meta');
        break;
      }
      arrayStage = this.decideArrayChange(relatedMeta, arrayStage);

      //after operation, if there is nested a object, meta gonna be changed
      if (relatedMeta.subObjectKey) {
        if (arrayStage != 1) {
          currentPropertyMeta = getPropertyMetaHolder().getMetas(
            relatedMeta.subObjectKey
          );
          currentRootMeta = getStructureRootMetaHolder().getMetas(
            relatedMeta.subObjectKey
          );
        }
      }
    }
    return currentValue;
  }

  initializeValueByPath(path: string): void {
    let otherKeys = this.destructPath(path);
    const latestKey = otherKeys[otherKeys.length - 1];
  }

  setValueByPath(path: string, value: any): void {
    let otherKeys = this.destructPath(path);
    let currentValue: any = this.value;
    if (otherKeys.length == 1) {
      currentValue[otherKeys[0]] = value;
      this.valueUpdate.next(this.value);
    } else {
      const latestKey = otherKeys[otherKeys.length - 1];
      otherKeys = otherKeys.slice(0, otherKeys.length - 1);
      if (otherKeys.length >= 1) {
        const valueRef = this.getValueByPath(this.buildPath(...otherKeys));
        valueRef[latestKey] = value;
        this.valueUpdate.next(this.value);
      }
    }
  }

  setFileByPath(path: string, file: File[]): void {
    this.fileMap.set(path, file);
  }

  getFiles() {
    const fileList: { key: string; files: File[] }[] = [];

    this.fileMap.forEach((files, key) => {
      fileList.push({ key, files });
    });
    return fileList;
  }

  private decideArrayChange(
    relatedMeta: PropertyMeta<any> | undefined,
    stge: number
  ) {
    if (relatedMeta?.inputType == 'array') {
      if (stge == 0) stge = 1;
      else if (stge == 1) stge = 2;
      else if (stge == 2) stge = 1;
    } else {
      stge = 0;
    }
    return stge;
  }

  private nullSafeValueGetter(
    parentObject: any,
    key: string,
    excludeArray: boolean,
    keyPropertyMeta?: PropertyMeta<T> | undefined
  ) {
    let childObject = parentObject[key];
    childObject = this.tryToTurnNonNullIfIt(
      childObject,
      keyPropertyMeta,
      excludeArray
    );
    // it is set just in case of set operation situations
    parentObject[key] = childObject;
    return childObject;
  }

  private tryToTurnNonNullIfIt(
    childObject: any,
    keyPropertyMeta: PropertyMeta<T> | undefined,
    excludeArray: boolean
  ) {
    if (childObject == null) {
      // Primitive types auto-construction
      if (!excludeArray && keyPropertyMeta?.inputType == 'array') {
        childObject = [];
      } else if (keyPropertyMeta?.inputType == 'checkbox') {
        childObject = false;
      } else if (keyPropertyMeta?.inputType == 'number') {
        childObject = 0;
      } else if (keyPropertyMeta?.inputType == 'text') {
        childObject = '';
      }
      //fallback construction
      else if (keyPropertyMeta?.defaultValueConstructor) {
        childObject = keyPropertyMeta.defaultValueConstructor();
      }

      //structure root construction
      else if (keyPropertyMeta?.subObjectKey) {
        const rootMeta = getStructureRootMetaHolder().getMetas(
          keyPropertyMeta.subObjectKey
        );
        if (rootMeta?.fallbackConstruction) {
          childObject = rootMeta.fallbackConstruction();
        }
      }
    }
    return childObject;
  }

  getAllMetasPaths(
    propertyMetas = this.propertyMetas,
    prefix = ''
  ): MetaPath[] {
    let metapaths: MetaPath[] = [];
    for (let index = 0; index < propertyMetas.length; index++) {
      const propertyMeta = propertyMetas[index];
      const path = this.buildPath(prefix, propertyMeta.name);

      if (propertyMeta.inputType == 'array') {
        const lenth = (this.getValueByPath(path) as Array<any>).length;
        for (let arrayIndex = 0; arrayIndex < length; arrayIndex++) {
          if (propertyMeta.subObjectKey) {
            metapaths.push(
              ...this.subObjectMetaPaths(
                propertyMeta,
                this.buildPath(path, arrayIndex)
              )
            );
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
    const validations: ValidatorResult[] = [];
    const paths = this.getAllMetasPaths();
    for (let index = 0; index < paths.length; index++) {
      const path = paths[index];
      validations.push(...this.validationErrorByPath(path));
    }
    return validations;
  }

  validationErrorByPath(path: MetaPath) {
    let value: any = null;
    if (path.meta.inputType == 'file') {
      value = this.getFiles()?.find((a) => a.key == path.path)?.files[0];
    } else {
      value = this.getValueByPath(path.path);
    }
    const validations: ValidatorResult[] = [];
    path.meta.validators?.forEach((a) => {
      const validation = a.validate(value, this, path.meta);
      if (!validation.valid) validations.push(validation);
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
