import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[data]',
    standalone: false
})
export class DataDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
