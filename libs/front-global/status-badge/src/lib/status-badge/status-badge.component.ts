import { Component, Input } from '@angular/core';

export type StatusBadgeColor = 'red' | 'yellow' | 'blue' | 'green' | 'gray';

@Component({
  selector: 'lotus-web-status-badge',
  standalone: false,
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() color: StatusBadgeColor = 'gray';
}