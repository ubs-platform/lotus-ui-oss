import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'lotus-web-h1',
    templateUrl: './h1.component.html',
    styleUrls: ['./h1.component.scss'],
    standalone: false
})
export class H1Component {
  @Output() backButtonAction = new EventEmitter<void>();
  @Input() showBackButton = false;
}
