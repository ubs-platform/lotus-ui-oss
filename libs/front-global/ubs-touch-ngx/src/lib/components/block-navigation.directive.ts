import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
    selector: '[block-page]',
    standalone: false
})
export class BlockNavigationDirective {
  public readonly name = input<string>("", { alias: "block-page" });
  public title = input<string>("");
  constructor(public template: TemplateRef<any>) {}
}
