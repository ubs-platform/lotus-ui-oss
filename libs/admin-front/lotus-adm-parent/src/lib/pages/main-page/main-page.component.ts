import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthManagementService,
  RoleService,
} from '@lotus/front-global/auth';
import { SidebarItem } from '@lotus/front-global/sidebar';
import { mergeMap } from 'rxjs';
import {  fromPrimeIcon } from "@lotus/front-global/icon-type"

@Component({
  selector: 'lotus-web-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: false,
})
export class MainPageComponent {
  navigationItemList: SidebarItem[] = [
    new SidebarItem('users', 'admin.users', fromPrimeIcon( 'pi pi-users')),
    // new SidebarItem('books', '(Lotus) Kitaplar', fromPrimeIcon('pi pi-book')),
    new SidebarItem('comments', 'Yorumlar', fromPrimeIcon('pi pi-comments')),
    new SidebarItem('publisher-teams', '(Lotus) Yayıncı takımları', fromPrimeIcon('pi pi-users')),
    new SidebarItem(
      'notify/global-var',
      'Notify: Global Değişkenler',
      fromPrimeIcon('pi pi-cog')
    ),
    new SidebarItem('notify/template', 'Notify: Şablonlar', fromPrimeIcon('pi pi-box')),
    new SidebarItem(
      'feedback/user-message',
      'Geri bildirimler/Mesajlar',
      fromPrimeIcon('pi pi-envelope')
    ),
  ];
  currentNavigationItem: string = '';
  approvedRole: boolean = false;

  constructor(
    private authMan: AuthManagementService,
    private roleService: RoleService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.authMan
      .userChange()
      .pipe(mergeMap(() => this.roleService.hasRole(['ADMIN'])))
      .subscribe((a) => {
        this.approvedRole = a;
      });
  }

  changeCurrent($event: string) {
    this.router.navigate([$event], { relativeTo: this.activateRoute });
  }
}
