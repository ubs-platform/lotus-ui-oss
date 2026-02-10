import { Component, OnInit } from '@angular/core';
import { environment } from '@lotus-web/environment';
import { isTodayBetweenDates } from '@lotus/common-global/date-utils';
@Component({
  selector: 'lotus-web-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: false,
})
export class RegistrationComponent implements OnInit {
  items: { label: string; routerLink: string }[] = [];
  acceptUser: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // this.acceptUser = !isTodayBetweenDates(
    //   new Date(2025, 4, 1, 0, 0, 0, 0),
    //   new Date(2025, 5, 17, 0, 0, 0, 0)
    // );
  }
}
