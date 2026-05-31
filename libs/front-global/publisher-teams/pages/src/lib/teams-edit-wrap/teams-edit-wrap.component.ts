import { Component, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'lib-teams-edit-wrap',
  standalone: false,
  templateUrl: './teams-edit-wrap.component.html',
  styleUrl: './teams-edit-wrap.component.scss',
})
export class TeamsEditWrapComponent implements OnInit {
  currentMenu = signal<string>('edit');
  tabView = viewChild<any>('tabView');

  /**
   *
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.syncTabFromRoute();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncTabFromRoute());
  }

  navigateTo(path: string) {
    this.currentMenu.set(path);
    this.router.navigate([path], { relativeTo: this.activatedRoute });
  }

  onTabSelected(path: string) {
    if (path === this.currentMenu()) {
      return;
    }

    this.navigateTo(path);
  }

  private syncTabFromRoute() {
    const currentPath = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    if (!currentPath) {
      this.navigateTo('edit');
      return;
    }

    this.currentMenu.set(currentPath);
    this.tabView()?.select(currentPath);
  }


}
