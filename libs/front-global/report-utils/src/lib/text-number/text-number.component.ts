import { Component, ViewEncapsulation, input } from '@angular/core';

@Component({
    selector: 'lib-text-number',
    templateUrl: './text-number.component.html',
    styleUrl: './text-number.component.scss',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TextNumberComponent {
  readonly bigScreenAligment = input<'center' | 'start' | 'end'>('center');
}
