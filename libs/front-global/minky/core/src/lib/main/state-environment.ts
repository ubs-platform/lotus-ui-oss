export interface ApplicationEnvironment {
    [key: string]: any;
}

export interface StateEnvironment {
  formValue?: any;
}

export interface CombinedEnvironment {
  state: StateEnvironment;
  app?: ApplicationEnvironment;
  parameters: Map<string, any>
}