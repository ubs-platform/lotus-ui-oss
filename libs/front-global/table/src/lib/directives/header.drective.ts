import { Directive, TemplateRef, input } from '@angular/core';
import { TranslatorText } from '@lotus/extra/translator-core';

@Directive({
    selector: '[header]',
    standalone: false
})
export class HeaderDirective {
  readonly content = input<TranslatorText>();

  constructor(public templateRef: TemplateRef<any>) {}
}
