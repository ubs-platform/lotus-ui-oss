import {
  Component,
  ContentChild,
  Directive,
  TemplateRef,
  input
} from '@angular/core';
import { HeaderDirective } from '../../directives/header.drective';
import { DataDirective } from '../../directives/data.drective';

@Component({
  selector: 'column',
  template: '',
  standalone: false,
})
export class ColumnComponent {
  @ContentChild(HeaderDirective) head?: HeaderDirective;
  @ContentChild(DataDirective) data?: DataDirective;
  readonly name = input.required<string>();
  readonly width = input<string>();

  constructor() {}
}
