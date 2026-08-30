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
    new SidebarItem('', 'general._', undefined, of(true), "category"),
    new SidebarItem('', 'general.home', fromMaterialSymbol('home')),
    new SidebarItem('', 'mona.santral', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('users', 'general.users', fromMaterialSymbol('group'), this.isNotReallyAdmin),
    // new SidebarItem('comments', 'Yorumlar', fromPrimeIcon('pi pi-comments'), this.isNotReallyAdmin),
    new SidebarItem('publisher-teams', 'general.teams', fromMaterialSymbol('group'), this.isNotReallyAdmin, "button"),

    new SidebarItem('', 'Tanımlamalar', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('comission', 'postral.menu.application-commissions', fromMaterialSymbol('payments'), this.isNotReallyAdmin),
    new SidebarItem('admin-settings', 'postral.menu.admin-settings', fromMaterialSymbol('settings'), this.isNotReallyAdmin),
    new SidebarItem('', 'postral.menu.integrations', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('payment-channel-config', 'postral.menu.payment-channels', fromMaterialSymbol('credit_card'), this.isNotReallyAdmin),
    new SidebarItem('external-platforms', 'postral.menu.external-platforms', fromMaterialSymbol('cloud'), this.isNotReallyAdmin),
    new SidebarItem('', 'postral.menu.reports', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('report-query', 'postral.menu.report-queries', fromMaterialSymbol('search'), this.isNotReallyAdmin),
    new SidebarItem('reports', 'postral.menu.all-reports', fromMaterialSymbol('description'), this.isNotReallyAdmin),
    new SidebarItem('', 'postral.menu.admin-actions', undefined, this.isNotReallyAdmin, "category"),
    new SidebarItem('admin-operations', 'postral.menu.admin-actions', fromMaterialSymbol('lock'), this.isNotReallyAdmin),
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
