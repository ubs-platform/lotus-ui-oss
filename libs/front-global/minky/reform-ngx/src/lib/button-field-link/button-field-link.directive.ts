import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[button-link]',
    standalone: false
})
export class ButtonFieldLinkDirective {
  constructor(public template: TemplateRef<any>) {}
}
