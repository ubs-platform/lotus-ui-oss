import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReformNgxPrimeComponent } from './reform-ngx-prime/reform-ngx-prime.component';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { FileUploadModule } from 'primeng/fileupload';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { CustomSelectComponent } from '@lotus/legendary-front/custom-select';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { ToggleComponent } from '@lotus/front-global/input/toggle';
@NgModule({
  imports: [
    CommonModule,
    MinkyReformNgxModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    MessageModule,
    FileUploadModule,
    PasswordModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    CalendarModule,
    RadioButtonModule,
    FrontGlobalButtonModule,
    CustomSelectComponent,
    UbsTranslatorNgxModule,
    ToggleComponent
  ],
  declarations: [ReformNgxPrimeComponent],
  exports: [ReformNgxPrimeComponent],
})
export class MinkyReformNgxPrimeModule {}
