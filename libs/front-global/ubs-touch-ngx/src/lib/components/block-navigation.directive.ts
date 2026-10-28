import { Directive, TemplateRef, input } from '@angular/core';
import { IIcon } from '@lotus/front-global/icon-type';

@Directive({
    selector: '[block-page]',
    standalone: false
})
export class BlockNavigationDirective {
  public readonly name = input<string>("", { alias: "block-page" });
  public title = input<string>("");
  public iconClass = input<string>("");
  public iconContent = input<string>("");
  public iconImageSource = input<string>("");
  constructor(public template: TemplateRef<any>) {}
}
