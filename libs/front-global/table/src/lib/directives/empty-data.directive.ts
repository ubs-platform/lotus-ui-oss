import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[empty-data]',
    standalone: false
})
export class EmptyDataDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
