import { Component, contentChildren } from '@angular/core';
import { ActionItemDirective } from './action-item.directive';

@Component({
  selector: 'lotus-web-data-list-layout',
  templateUrl: './data-list-layout.component.html',
  styleUrls: ['./data-list-layout.component.scss'],
  standalone: false,
})
export class DataListLayoutComponent {
  actionItems = contentChildren<ActionItemDirective>(ActionItemDirective);

}
