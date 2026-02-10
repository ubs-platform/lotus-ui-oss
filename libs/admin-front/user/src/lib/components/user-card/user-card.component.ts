import { Component, input } from '@angular/core';
import { UserDTO } from '@ubs-platform/users-common';

@Component({
    selector: 'lotus-web-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    standalone: false
})
export class UserCardComponent {
  readonly userAuthDTO = input.required<UserDTO>();
}
