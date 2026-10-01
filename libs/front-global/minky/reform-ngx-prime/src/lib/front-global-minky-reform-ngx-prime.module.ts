import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReformNgxPrimeComponent } from './reform-ngx-prime/reform-ngx-prime.component';
import { InputFieldLinkDirective } from './input-field-link/input-field-link.directive';
import { ButtonFieldLinkDirective } from './button-field-link/button-field-link.directive';
import { GroupLabelFieldLinkDirective } from './group-label-field-link/group-label-field-link.directive';
import { FormsModule } from '@angular/forms';
import { FrontGlobalMessageModule } from '@lotus/front-global/message';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { CustomSelectComponent } from '@lotus/legendary-front/custom-select';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { ToggleComponent } from '@lotus/front-global/input/toggle';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FrontGlobalMessageModule,
    FrontGlobalButtonModule,
    CustomSelectComponent,
    UbsTranslatorNgxModule,
    ToggleComponent,
    FrontGlobalMinkyReformNgxMonaModule,
  ],
  declarations: [
    ReformNgxPrimeComponent,
    InputFieldLinkDirective,
    ButtonFieldLinkDirective,
    GroupLabelFieldLinkDirective,
  ],
  exports: [
    ReformNgxPrimeComponent,
    InputFieldLinkDirective,
    ButtonFieldLinkDirective,
    GroupLabelFieldLinkDirective,
  ],
})
export class MinkyReformNgxPrimeModule {}
