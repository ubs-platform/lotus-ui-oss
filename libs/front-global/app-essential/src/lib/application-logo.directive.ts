import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appLogo]',
    standalone: false
})
export class ApplicationLogoDirective {
  constructor(public template: TemplateRef<any>) {}
}
