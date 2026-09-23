import { Observable } from "rxjs";

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
}

export interface CombinedEnvironment {
  state: StateEnvironment;
  app?: ApplicationEnvironment;
  parameters: Map<string, any>
}