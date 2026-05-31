import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityOwnershipGroupControllerService } from '@lotus/front-global/entity-ownership';
import {
  EOGUserCapabilityDTO,
  EOGUserCapabilityInvitationDTO,
  UserAuth,
  UserDTO,
} from '@ubs-platform/users-common';
import { ActivatedRoute } from '@angular/router';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { forkJoin, mergeMap } from 'rxjs';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { AuthManagementService, AuthService } from '@lotus/front-global/auth';
import { Reform } from '@lotus/front-global/minky/core';
import { EntityOwnershipInvitationForm } from './entity-ownership-invitation.form';
import { EntityOwnershipMemberEditForm } from './entity-ownership-member-role-edit.form';
import {
  ENTITY_GROUP_LOTUS,
  ENTITY_GROUP_POSTRAL,
  ENTITY_NAME_POSTRAL_ACCOUNT,
  ENTITY_NAME_POSTRAL_ADDRESS,
  ENTITY_NAME_POSTRAL_ITEM,
  ENTITY_NAME_POSTRAL_TAX,
  ENTITY_NAME_QUESTION,
  ENTITY_NAME_QUESTION_BOOK,
} from '@lotus/lotus-common/consts';
@Component({
  selector: 'team-members',
  standalone: false,
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.scss',
})
export class TeamMembersComponent {
  userCapabilities = signal<EOGUserCapabilityDTO[]>([]);
  userCapabilityInvitations = signal<EOGUserCapabilityInvitationDTO[]>([]);
  publisherTeamId = '';
  currentUser?: UserDTO;

  constructor(
    private eog: EntityOwnershipGroupControllerService,
    private route: ActivatedRoute,
    private service: PublisherTeamService,
    private overlay: BasicOverlayService,
    private auth: AuthManagementService
  ) {}

  removeUserShow(item: EOGUserCapabilityDTO) {
    let userMessage;

    if (item.userId === this.currentUser?.id) {
      userMessage = this.overlay.confirm(
        'Kendi hesabınızı kaldır',
        'Kendi hesabınızı kaldırıyorsunuz, kendi hesabınızı kaldırdığınızda bu takıma erişiminiz olmayacak. Devam etmek istediğinize emin misiniz?'
      );
    } else {
      userMessage = this.overlay.confirm(
        'Kullanıcıyı kaldır',
        'Kullanıcıyı kaldırmaktan emin misiniz?'
      );
    }

    userMessage.subscribe((confirmed) => {
      if (confirmed) {
        this.eog
          .removeUserFromEntityOwnership(this.publisherTeamId, item.userId)
          .subscribe({
            next: () => {
              this.userCapabilities.set(
                this.userCapabilities().filter((u) => u.userId !== item.userId)
              );
            },
            error: (error) => {
              this.overlay.alert(
                'Hata',
                'Kullanıcıyı kaldırırken bir hata oluştu: ' +
                  error.error.message,
                'error'
              );
              console.error('Error removing user:', error);
            },
          });
      }
    });
  }

  ngOnInit(): void {
    this.auth.userChange().subscribe((info) => {
      this.currentUser = info!;
    });

    this.route.parent!.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.publisherTeamId = id!;
      if (id) {
        this.reloadLists();
      }
    });
  }

  private reloadLists() {
    forkJoin({
      users: this.eog.fetchUsersInGroup(this.publisherTeamId),
      invitations: this.eog.fetchUserCapabilityInvitations(
        this.publisherTeamId
      ),
    }).subscribe((res) => {
      this.userCapabilities.set(res.users);
      this.userCapabilityInvitations.set(res.invitations);
    });
  }

  addAccountShow() {
    const reform = this.inviteForm();

    this.overlay
      .reformDialog(reform, 'Takıma Üye Ekle')
      .subscribe((formResult) => {
        if (formResult) {
          const form = reform.value as EntityOwnershipInvitationForm;
          this.eog
            .addUserToEntityOwnership(this.publisherTeamId, {
              userLogin: form.anyLogin,
              entityCapabilities: [
                {
                  entityGroup: ENTITY_GROUP_LOTUS,
                  entityName: ENTITY_NAME_QUESTION_BOOK,
                  capability: form.contentCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_ACCOUNT,
                  capability: form.accountManagementCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_ADDRESS,
                  capability: form.addressManagementCapability,
                },
              ],
              groupCapability: form.groupCapability,
            })
            .subscribe(() => {
              this.overlay.alert(
                'Kişi davet edildi',
                'Eğer davet ettiğiniz kişi kabul ederse, takım üyeleri arasında görünecektir.',
                'info'
              );
            });
        }
      });
  }


  editUserShow(item: EOGUserCapabilityDTO) {
    let bookRole = '', postralAccountRole = '', postralAddressRole = '', postralTaxRole = '', postralItemRole = '';
    for (let index = 0; index < item.entityCapabilities.length; index++) {
      const entityCapability = item.entityCapabilities[index];
      if (entityCapability.entityGroup === ENTITY_GROUP_LOTUS) {
        switch (entityCapability.entityName) {
          case ENTITY_NAME_QUESTION_BOOK:
            bookRole = entityCapability.capability;
            break;
        }
      } else if (entityCapability.entityGroup === ENTITY_GROUP_POSTRAL) {
        switch (entityCapability.entityName) {
          case ENTITY_NAME_POSTRAL_ACCOUNT:
            postralAccountRole = entityCapability.capability;
            break;
          case ENTITY_NAME_POSTRAL_ADDRESS:
            postralAddressRole = entityCapability.capability;
            break;
          case ENTITY_NAME_POSTRAL_TAX:
            postralTaxRole = entityCapability.capability;
            break;
          case ENTITY_NAME_POSTRAL_ITEM:
            postralItemRole = entityCapability.capability;
            break;
        }

      }
    }

    const reform = new Reform(EntityOwnershipMemberEditForm, {
      contentCapability: bookRole,
      accountManagementCapability: postralAccountRole,
      addressManagementCapability: postralAddressRole,
      taxManagementCapability: postralTaxRole,
      itemManagementCapability: postralItemRole,
      groupCapability: item.groupCapability,
    } as EntityOwnershipMemberEditForm);

    this.overlay
      .reformDialog(reform, 'Üye Yetkilerini Düzenle')
      .subscribe((formResult) => {
        if (formResult) {
          const form = reform.value as EntityOwnershipMemberEditForm;
          this.eog
            .editUserCapabilityEntityOwnership(this.publisherTeamId, {
              userId: item.userId,
              userFullName: item.userFullName,
              // userCapabilityTemplateName: item.userCapabilityTemplateName,
              entityCapabilities: [
                {
                  entityGroup: ENTITY_GROUP_LOTUS,
                  entityName: ENTITY_NAME_QUESTION_BOOK,
                  capability: form.contentCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_ACCOUNT,
                  capability: form.accountManagementCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_ADDRESS,
                  capability: form.addressManagementCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_TAX,
                  capability: form.taxManagementCapability,
                },
                {
                  entityGroup: ENTITY_GROUP_POSTRAL,
                  entityName: ENTITY_NAME_POSTRAL_ITEM,
                  capability: form.itemManagementCapability,
                },
              ],
              groupCapability: form.groupCapability,
            })
            .subscribe({
              next: (updatedItem) => {
                this.reloadLists();
                this.overlay.alert(
                  'Başarılı',
                  'Üye yetkileri başarıyla güncellendi.',
                  'success'
                );
              },
              error: (err) => {
                this.overlay.alert(
                  'Hata',
                  'Üye yetkileri güncellenirken bir hata oluştu. ' +
                    err.error.message,
                  'error'
                );
                console.error('Error updating member capabilities:', err);
              },
            });
        }
      });
  }

  inviteForm() {
    const reform = new Reform(EntityOwnershipInvitationForm);
    // invitationFormSelectFeeders(
    //   reform,
    //   this.bookRoleOptionsFetcher,
    //   this.postralRoleOptionsFetcher
    // );
    return reform;
  }

  removeInvitation(item: EOGUserCapabilityInvitationDTO) {
    this.overlay
      .confirm('Daveti Sil', 'Bu daveti silmek istediğinize emin misiniz?')
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.removeInvitationConfirmed(item);
      });
  }

  private removeInvitationConfirmed(item: EOGUserCapabilityInvitationDTO) {
    this.eog
      .removeUserFromEntityOwnershipInvitation(
        this.publisherTeamId,
        item.invitationId
      )
      .subscribe({
        next: () => {
          this.userCapabilityInvitations.set(
            this.userCapabilityInvitations().filter(
              (u) => u.invitationId !== item.invitationId
            )
          );
        },
        error: (error) => {
          this.overlay.alert(
            'Hata',
            'Daveti silerken bir hata oluştu: ' + error.error.message,
            'error'
          );
          console.error('Error removing invitation:', error);
        },
      });
  }
}
