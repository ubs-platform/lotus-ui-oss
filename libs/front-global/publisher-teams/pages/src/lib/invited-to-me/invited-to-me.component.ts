import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthManagementService } from '@lotus/front-global/auth';
import { EntityOwnershipGroupControllerService } from '@lotus/front-global/entity-ownership';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { EOGUserCapabilityInvitationDTO } from '@ubs-platform/users-common';

@Component({
  selector: 'lib-invited-to-me',
  standalone: false,
  templateUrl: './invited-to-me.component.html',
  styleUrl: './invited-to-me.component.scss',
})
export class InvitedToMeComponent {
  invitations = signal<EOGUserCapabilityInvitationDTO[]>([]);
  /**
   *
   */
  constructor(
    private eog: EntityOwnershipGroupControllerService,
    private route: ActivatedRoute,
    private service: PublisherTeamService,
    private overlay: BasicOverlayService,
    private auth: AuthManagementService,
    private router: Router
  ) { }

  removeInvitation(invitation: EOGUserCapabilityInvitationDTO) {
    this.overlay.confirm("Daveti reddet", "Bu daveti reddetmek istediğinize emin misiniz?").subscribe((res) => {
      if (res) {
        this.eog.refuseInvitation(invitation.invitationId).subscribe(() => {
          this.removeInvitationFromList(invitation);
        });
      }
    });
    // this.overlay
    //   .confirm({
    //     message: 'Bu daveti kaldırmak istediğinize emin misiniz?',
    //   })
    //   .then((res) => {
    //     if (res === 'CONFIRMED') {
    //       this.eog.deleteUserCapabilityInvitation(invitation.id).subscribe(() => {
    //         this.invitations.update(u => u.filter((i) => i.id !== invitation.id));
    //       });
    //     }
    //   });
  }

  private removeInvitationFromList(invitation: EOGUserCapabilityInvitationDTO) {
    this.invitations.update(u => u.filter((i) => i.invitationId !== invitation.invitationId));
  }

  acceptInvitation(invitation: EOGUserCapabilityInvitationDTO) {
    this.overlay.confirm("Daveti kabul et", "Bu daveti kabul etmek istediğinize emin misiniz?").subscribe((res) => {
      if (res) {
        this.eog.acceptInvitationToEog(invitation.invitationId).subscribe(() => {
          this.removeInvitationFromList(invitation);
            this.router.navigate(['/publisher-teams', invitation.eogId, "members"]);

          // this.invitations.set(this.invitations().filter((i) => i.invitationId !== invitation.invitationId));
        });
      }
    });
  }

  ngOnInit() {
    // Component initialization logic
    this.eog.fetchMyInvitations().subscribe((invitations) => {
      this.invitations.set(invitations);
    });
  }
}
