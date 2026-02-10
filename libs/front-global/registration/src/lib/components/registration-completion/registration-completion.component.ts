import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'lotus-web-registration-completion',
    templateUrl: './registration-completion.component.html',
    styleUrls: ['./registration-completion.component.scss'],
    standalone: false
})
export class RegistrationCompletionComponent {
  constructor(private router: Router) {}
  navigateBack() {
    this.router.navigate(['registration', 'information']);
  }
  navigateHome() {
    this.router.navigate(['']);
  }
}
