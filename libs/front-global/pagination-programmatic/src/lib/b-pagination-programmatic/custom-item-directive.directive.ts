import {
  ContentChildren,
  Directive,
  QueryList,
  TemplateRef,
  input
} from '@angular/core';

@Directive({
    selector: '[custom-item]',
    standalone: false
})
export class CustomItemDirective {
  readonly name = input.required<string>({ alias: "custom-item" });

  constructor(public template: TemplateRef<any>) {}
}
