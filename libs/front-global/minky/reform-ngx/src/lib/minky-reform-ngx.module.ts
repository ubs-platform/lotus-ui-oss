import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinkyReformComponent } from './minky-reform/minky-reform.component';
import { InputFieldLinkDirective } from './input-field-link/input-field-link.directive';
import { FormsModule } from '@angular/forms';
import { ButtonFieldLinkDirective } from './button-field-link/button-field-link.directive';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { GroupLabelFieldLinkDirective } from './group-label-field-link/group-label-field-link.directive';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    MinkyReformComponent,
    InputFieldLinkDirective,
    ButtonFieldLinkDirective,
    GroupLabelFieldLinkDirective,
  ],
  exports: [
    MinkyReformComponent,
    InputFieldLinkDirective,
    ButtonFieldLinkDirective,
    GroupLabelFieldLinkDirective,
  ],
})
export class MinkyReformNgxModule {}
