import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsListingComponent } from './teams-listing/teams-listing.component';
import { TeamsEditComponent } from './teams-edit/teams-edit.component';
import { ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { RouterModule } from '@angular/router';
import { PublisherTeamClientModule } from '@lotus/front-global/publisher-teams/client';
import { TeamsEditWrapComponent } from './teams-edit-wrap/teams-edit-wrap.component';
import { PagesRouterModule } from './pages-router.module';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { TeamMembersComponent } from './team-members/team-members.component';
import { InvitedToMeComponent } from './invited-to-me/invited-to-me.component';
import { OnpageHeaderComponent } from "@lotus/front-global/dynamic-headers";
import { UbsTouchNgxModule } from "@lotus/front-global/ubs-touch-ngx";
import { TabViewComponent } from '@lotus/front-global/tab-view';

@NgModule({
  imports: [
    CommonModule,
    ReformDataEditComponent,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    RouterModule,
    PagesRouterModule,
    FrontGlobalSidebarModule,
    OnpageHeaderComponent,
    UbsTouchNgxModule,
    TabViewComponent,
  ],
  declarations: [
    TeamsListingComponent,
    TeamsEditComponent,
    TeamsEditWrapComponent,
    TeamMembersComponent,
    InvitedToMeComponent,
  ],
  exports: [
    TeamsListingComponent,
    TeamsEditComponent,
    TeamsEditWrapComponent,
    TeamMembersComponent,
    InvitedToMeComponent,
  ],
})
export class PagesModule { }
