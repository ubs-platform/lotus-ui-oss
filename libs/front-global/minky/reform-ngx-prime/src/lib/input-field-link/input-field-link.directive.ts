import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: '[input-link]',
  standalone: false,
})
export class InputFieldLinkDirective {
  readonly path = input<string>();
  readonly overrideDefault = input(true);
  constructor(public template: TemplateRef<any>) {}
}
