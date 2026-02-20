import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[header]',
    standalone: false
})
export class HeaderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
