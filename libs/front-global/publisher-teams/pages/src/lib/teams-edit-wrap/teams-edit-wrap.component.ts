import { Component, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
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
  teamName: string = "";

  /**
   *
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private publisherTeamService: PublisherTeamService) {}

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

    const teamId = this.activatedRoute.snapshot.paramMap.get('id');
    this.publisherTeamService.get(teamId).subscribe((team) => {
      if (!team) {
        // this.navigateTo('edit');
        return;
      }
      this.teamName = team.name;
    });
    const currentPath = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    if (!currentPath) {
      this.navigateTo('edit');
      return;
    }

    this.currentMenu.set(currentPath);
    this.tabView()?.select(currentPath);
  }


}
