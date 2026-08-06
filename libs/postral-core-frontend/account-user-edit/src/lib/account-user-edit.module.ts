import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountUserEditRouterModule } from './account-user-edit-router.module';
import { AccountUserEditNorouteModule } from './account-user-edit-noroute.module';

@NgModule({
  imports: [
    AccountUserEditRouterModule,
    AccountUserEditNorouteModule
    
  ],
  declarations: [
    
  ],
  exports: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountUserEditModule {}
