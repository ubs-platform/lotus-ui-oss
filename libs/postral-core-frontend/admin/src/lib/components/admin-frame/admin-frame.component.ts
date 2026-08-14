import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthManagementService, RoleService } from '@lotus/front-global/auth';
import { SidebarItem } from '@lotus/front-global/sidebar';
import { fromMaterialSymbol } from 'libs/front-global/icon-type/src/lib/icon-type';
import { from, map, mergeMap, Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'postral-core-admin-frame',
  standalone: false,
  templateUrl: './admin-frame.component.html',
  styleUrls: ['./admin-frame.component.scss'],
})
export class AdminFrameComponent {
  currentNavigationItem: string = '';
  approvedRole: boolean = false;
  isNotReallyAdmin: Subject<boolean> = new Subject<boolean>();

  navigationItemList: SidebarItem[] = [
    new SidebarItem('', 'Genel', undefined, of(true), "category"),
    new SidebarItem('', 'Ana sayfa', fromMaterialSymbol('home')),
    new SidebarItem('', 'UBS Platform Santrali', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('users', 'Kullanıcılar', fromMaterialSymbol('group'), this.isNotReallyAdmin),
    // new SidebarItem('comments', 'Yorumlar', fromPrimeIcon('pi pi-comments'), this.isNotReallyAdmin),
    new SidebarItem('publisher-teams', 'Takımlar', fromMaterialSymbol('group'), this.isNotReallyAdmin),

    new SidebarItem('', 'Tanımlamalar', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('comission', 'Uygulama komisyonları', fromMaterialSymbol('payments'), this.isNotReallyAdmin),
    new SidebarItem('admin-settings', 'Admin ayarları', fromMaterialSymbol('settings'), this.isNotReallyAdmin),
    new SidebarItem('', 'Entegrasyonlar', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('payment-channel-config', 'Ödeme Kanalları', fromMaterialSymbol('credit_card'), this.isNotReallyAdmin),
    new SidebarItem('external-platforms', 'Harici Platformlar', fromMaterialSymbol('cloud'), this.isNotReallyAdmin),
    new SidebarItem('', 'Raporlar', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('report-query', 'Rapor sorguları', fromMaterialSymbol('search'), this.isNotReallyAdmin),
    new SidebarItem('reports', 'Raporlar', fromMaterialSymbol('description'), this.isNotReallyAdmin),
    new SidebarItem('', 'Bakım', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('admin-operations', 'Admin işlemleri', fromMaterialSymbol('lock'), this.isNotReallyAdmin),
  ];



  constructor(
    private authMan: AuthManagementService,
    private roleService: RoleService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {

    this.authMan.userChange().pipe(mergeMap(() => this.roleService.hasRole(['ADMIN', 'POSTRAL_ADMIN']))).subscribe(a => this.isNotReallyAdmin.next(!a));
  }

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
