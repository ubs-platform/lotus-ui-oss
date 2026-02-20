import {
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';
import { HeaderDirective } from './header.drective';
import { DataDirective } from './data.drective';

@Component({
    selector: 'column',
    template: '',
    standalone: false
})
export class ColumnComponent {
  @ContentChild(HeaderDirective) head!: HeaderDirective;
  @ContentChild(DataDirective) data!: DataDirective;
  @Input('name') name!: string;
  @Input('under-md') showUnderMd = false;
  @Input() sticky = false;

  constructor() {}
}
