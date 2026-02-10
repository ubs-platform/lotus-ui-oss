import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appFooter]',
    standalone: false
})
export class ApplicationFooterDirective {
  constructor(public template: TemplateRef<any>) {}
}
