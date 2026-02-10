import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[group-label-link]',
    standalone: false
})
export class GroupLabelFieldLinkDirective {
  constructor(public template: TemplateRef<any>) {}
}
