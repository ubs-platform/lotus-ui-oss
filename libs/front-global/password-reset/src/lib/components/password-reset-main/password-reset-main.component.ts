import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lotus-web-password-reset-main',
    templateUrl: './password-reset-main.component.html',
    styleUrls: ['./password-reset-main.component.scss'],
    standalone: false
})
export class RegistrationComponent implements OnInit {
  items: { label: string; routerLink: string }[] = [];

  constructor() {}

  ngOnInit(): void {}
}
