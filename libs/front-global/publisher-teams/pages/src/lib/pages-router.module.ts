import { NgModule } from "@angular/core";
import { TeamsListingComponent } from "./teams-listing/teams-listing.component";
import { RouterModule } from "@angular/router";
import { TeamsEditWrapComponent } from "./teams-edit-wrap/teams-edit-wrap.component";
import { TeamsEditComponent } from "./teams-edit/teams-edit.component";
import { TeamMembersComponent } from "./team-members/team-members.component";
import { InvitedToMeComponent } from "./invited-to-me/invited-to-me.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'invitations-for-me', component: InvitedToMeComponent },
            { path: '', component: TeamsListingComponent },
            {
                path: ':id', component: TeamsEditWrapComponent,
                children: [
                    { path: 'edit', component: TeamsEditComponent },
                    { path: 'members', component: TeamMembersComponent }
                ]
            },
        ]),
    ],
})
export class PagesRouterModule { }