import { Injector } from '@angular/core';
import {
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class GlobalVariableWriteForm {
  @minky({ validators: [new RequiredValidator()] })
  name: string = '';

  @minky({
    validators: [new RequiredValidator()],
    selectItems: (env) => {
      // const injector =  (env.app['injector'] as Injector).get();
      return [];
    },
  })
  language: string = '';

  @minky({ validators: [] })
  value: string = '';
}
