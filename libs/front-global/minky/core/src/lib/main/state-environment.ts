import { Observable } from "rxjs";

export interface ApplicationEnvironment {
    [key: string]: any;
}

export interface StateEnvironment {
  formValue?: any;
  onChanges?: Observable<any>;
}

export interface CombinedEnvironment {
  state: StateEnvironment;
  app?: ApplicationEnvironment;
  parameters: Map<string, any>
}