import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: '[action]',
  standalone: false,
})
export class ActionItemDirective {
    /**
     *
     */
    constructor(public templateRef: TemplateRef<any>) {
        
    }
}