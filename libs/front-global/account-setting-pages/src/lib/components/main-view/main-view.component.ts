import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromPrimeIcon } from '@lotus/front-global/icon-type';
import { SidebarItem } from '@lotus/front-global/sidebar';
import { PrimeIcons } from 'primeng/api';
import { of } from 'rxjs';

@Component({
    selector: 'lotus-web-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.scss'],
    standalone: false
})
export class MainViewComponent implements OnInit {
  menuItems!: SidebarItem[];
  currentMenu!: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentMenu = activatedRoute.snapshot.firstChild?.url[0].path!;
  }

  ngOnInit(): void {
    this.menuItems = [
      new SidebarItem('thumb-photo', 'Profil fotoğrafı', fromPrimeIcon('pi pi-image')),
      new SidebarItem('information', 'Hesap bilgileri', fromPrimeIcon('pi pi-user')),
      new SidebarItem('security', 'Güvenlik', fromPrimeIcon('pi pi-lock')),
    ];
  }

  navigate(to: string) {
    this.currentMenu = to;
    this.router.navigate(['account', to]);
  }

  loadMenusAndContent(menu: string) {
    this.currentMenu = menu!;
  }
}
