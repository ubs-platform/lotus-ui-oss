import { Component } from '@angular/core';
import { UserService } from '@lotus/front-global/auth';

@Component({
    selector: 'lotus-web-security-settings',
    templateUrl: './security-settings.component.html',
    styleUrls: ['./security-settings.component.scss'],
    standalone: false
})
export class SecuritySettingsComponent {
  constructor(private userService: UserService) {}
}
