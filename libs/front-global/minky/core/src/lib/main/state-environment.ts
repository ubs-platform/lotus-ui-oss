import { Observable } from "rxjs";
import { TranslatorText } from '@lotus/extra/translator-core';

export interface ApplicationEnvironment {
    [key: string]: any;
}

export interface StateEnvironment {
  formValue?: any;
  onChanges?: Observable<any>;
  setHidden?: (path: string, value: boolean | undefined) => void;
  setDisabled?: (path: string, value: boolean | undefined) => void;
  setData?: (path: string, value: any) => void;
  getData?: (path: string) => any;
  setWarning?: (path: string, message: TranslatorText | undefined) => void;
  setInfo?: (path: string, message: TranslatorText | undefined) => void;
}

export interface CombinedEnvironment {
  state: StateEnvironment;
  app?: ApplicationEnvironment;
  parameters: Map<string, any>
}