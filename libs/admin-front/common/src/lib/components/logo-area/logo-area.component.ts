import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'tk-santral-logo-area',
    templateUrl: './logo-area.component.html',
    styleUrls: ['./logo-area.component.scss'],
    standalone: false
})
export class LogoAreaComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateHome() {
    this.router.navigate(['']);
  }
}
