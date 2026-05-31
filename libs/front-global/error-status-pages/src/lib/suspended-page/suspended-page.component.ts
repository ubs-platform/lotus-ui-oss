import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'lotus-web-suspended-page',
    templateUrl: './suspended-page.component.html',
    styleUrls: ['./suspended-page.component.scss'],
    standalone: false
})
export class SuspendedPageComponent implements OnInit {
  reason: string = 'Unknown';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigationState =
      this.router.getCurrentNavigation()?.extras?.state?.['suspendReason'];
    const historyState = history.state?.['suspendReason'];
    const sessionState = sessionStorage.getItem('suspendReason');

    this.reason = navigationState ?? historyState ?? sessionState ?? 'Unknown';
  }
}
