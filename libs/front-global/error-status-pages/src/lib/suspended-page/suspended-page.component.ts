import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'lotus-web-suspended-page',
    templateUrl: './suspended-page.component.html',
    styleUrls: ['./suspended-page.component.scss'],
    standalone: false
})
export class SuspendedPageComponent {
  reason: string = 'Unknown';

  constructor(private router: Router) {
    this.reason = router.getCurrentNavigation()?.extras.state?.['reason'];
  }
}
