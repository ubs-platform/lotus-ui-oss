import { Component, computed, signal } from '@angular/core';
import { EntityOwnershipGroupControllerService } from '@lotus/front-global/entity-ownership';
import {
  Capability,
  EOGUserCapabilityDTO,
  EOGUserCapabilityInvitationDTO,
  UserDTO, EOGUserEntityCapabilityDTO
} from '@ubs-platform/users-common';
import { ActivatedRoute } from '@angular/router';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { forkJoin } from 'rxjs';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { AuthManagementService, RoleService } from '@lotus/front-global/auth';
import {
  TeamMemberCapabilityDialogComponent,
  TeamMemberCapabilityDialogData,
  TeamMemberCapabilityDialogResult,
} from './team-member-capability-dialog/team-member-capability-dialog.component';
import {
  DEFAULT_ENTITY_CAPABILITY_GROUPS,
  ENTITY_CAPABILITY_GROUPS_DATA_KEY,
  EntityCapabilityGroupConfig,
} from './entity-capability-group-config';
import { collectAncestorRouteData } from './route-data.util';
import { groupCapabilities } from './common-form-options';
import { StatusBadgeColor } from '@lotus/front-global/status-badge';

interface CapabilityBadge {
  label: string;
  color: StatusBadgeColor;
}

interface CapabilityCarrier {
  capabilities?: number[];
}

interface GroupCapabilityCarrier {
  groupCapabilities?: number[];
  capabilities?: number[];
}
@Component({
  selector: 'team-members',
  standalone: false,
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.scss',
})
export class TeamMembersComponent {
  userCapabilities = signal<EOGUserCapabilityDTO[]>([]);
  userCapabilityInvitations = signal<EOGUserCapabilityInvitationDTO[]>([]);
  currentUserId = signal<string | undefined>(undefined);
  isAdmin = signal(false);
  publisherTeamId = '';
  currentUser?: UserDTO;
  capabilityGroups: EntityCapabilityGroupConfig[] = DEFAULT_ENTITY_CAPABILITY_GROUPS;
  canAdjustMembers = computed(() => {
    if (this.isAdmin()) {
      return true;
    }

    const userId = this.currentUserId();
    if (!userId) {
      return false;
    }

    const me = this.userCapabilities().find((u) => u.userId === userId);
    const groupCaps = me?.groupCapabilities ?? [];
    return (
      groupCaps.includes(Capability.OWNER) ||
      groupCaps.includes(Capability.EOG_ADJUST_MEMBERS) ||
      groupCaps.includes(Capability.EOG_ADJUST_CAPABILITIES)
    );
  });

  canChangeCaps = computed(() => {
    if (this.isAdmin()) {
      return true;
    }

    const userId = this.currentUserId();
    if (!userId) {
      return false;
    }

    const me = this.userCapabilities().find((u) => u.userId === userId);
    const groupCaps = me?.groupCapabilities ?? [];
    return (
      groupCaps.includes(Capability.OWNER) ||
      groupCaps.includes(Capability.EOG_ADJUST_CAPABILITIES)
    );
  });

  private readonly capabilityLabelByValue = new Map<number, string>(
    groupCapabilities.map((cap) => [cap.value, cap.text])
  );

  private getCurrentUserCapabilityEntry(): EOGUserCapabilityDTO | undefined {
    const userId = this.currentUserId();
    if (!userId) {
      return undefined;
    }
    return this.userCapabilities().find((u) => u.userId === userId);
  }

  private getDialogPermissionContext(): {
    allowAllCapabilities: boolean;
    allowedGroupCapabilities?: number[];
    allowedEntityCapabilities?: EOGUserEntityCapabilityDTO[];
  } {
    const me = this.getCurrentUserCapabilityEntry();
    const groupCaps = me?.groupCapabilities ?? [];
    const allowAllCapabilities = this.isAdmin() || groupCaps.includes(Capability.OWNER);

    if (allowAllCapabilities) {
      return { allowAllCapabilities };
    }

    return {
      allowAllCapabilities: false,
      allowedGroupCapabilities: [...groupCaps],
      allowedEntityCapabilities: (me?.entityCapabilities ?? []).map((ec) => ({
        entityGroup: ec.entityGroup,
        entityName: ec.entityName,
        capabilities: [...(ec.capabilities ?? [])],
      })),
    };
  }

  constructor(
    private eog: EntityOwnershipGroupControllerService,
    private route: ActivatedRoute,
    private service: PublisherTeamService,
    private overlay: BasicOverlayService,
    private auth: AuthManagementService,
    private roleService: RoleService
  ) { }

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
      this.currentUserId.set(info?.id);

      if (!info) {
        this.isAdmin.set(false);
        return;
      }

      this.roleService.hasRole(['ADMIN']).subscribe((isAdmin) => {
        this.isAdmin.set(isAdmin);
      });
    });

    this.capabilityGroups =
      (collectAncestorRouteData(this.route)[
        ENTITY_CAPABILITY_GROUPS_DATA_KEY
      ] as EntityCapabilityGroupConfig[] | undefined) ??
      DEFAULT_ENTITY_CAPABILITY_GROUPS;

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
    const permissionContext = this.getDialogPermissionContext();
    this.overlay
      .showComponentAsDialog<TeamMemberCapabilityDialogData, TeamMemberCapabilityDialogResult | null>(
        TeamMemberCapabilityDialogComponent,
        {
          title: 'Takıma Üye Ekle',
          defaultOutValue: null,
          data: {
            groups: this.capabilityGroups,
            allowAllCapabilities: permissionContext.allowAllCapabilities,
            allowedGroupCapabilities: permissionContext.allowedGroupCapabilities,
            allowedEntityCapabilities: permissionContext.allowedEntityCapabilities,
          },
        }
      )
      .onClose()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.eog
          .addUserToEntityOwnership(this.publisherTeamId, {
            userLogin: result.anyLogin!,
            entityCapabilities: result.entityCapabilities,
            capabilities: result.groupCapabilities,
          })
          .subscribe(() => {
            this.overlay.alert(
              'Kişi davet edildi',
              'Eğer davet ettiğiniz kişi kabul ederse, takım üyeleri arasında görünecektir.',
              'info'
            );
          });
      });
  }


  editUserShow(item: EOGUserCapabilityDTO) {
    const permissionContext = this.getDialogPermissionContext();
    this.overlay
      .showComponentAsDialog<TeamMemberCapabilityDialogData, TeamMemberCapabilityDialogResult | null>(
        TeamMemberCapabilityDialogComponent,
        {
          title: 'general.member.edit-authority',
          defaultOutValue: null,
          height: "100dvh",
          maxHeight: "600px",
          data: {
            groups: this.capabilityGroups,
            existing: item,
            allowAllCapabilities: permissionContext.allowAllCapabilities,
            allowedGroupCapabilities: permissionContext.allowedGroupCapabilities,
            allowedEntityCapabilities: permissionContext.allowedEntityCapabilities,
          },
        }
      )
      .onClose()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.eog
          .editUserCapabilityEntityOwnership(this.publisherTeamId, {
            userId: item.userId,
            userFullName: item.userFullName,
            entityCapabilities: result.entityCapabilities,
            groupCapabilities: result.groupCapabilities,
          })
          .subscribe({
            next: () => {
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
      });
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

  getEntityCapabilityBadges(item: CapabilityCarrier): CapabilityBadge[] {
    const numericCaps = this.normalizeNumberCapabilities(item.capabilities);
    if (numericCaps.length > 0) {
      return numericCaps.map((cap) => this.toCapabilityBadge(cap));
    }

    return [];
  }

  getGroupCapabilityBadges(item: GroupCapabilityCarrier): CapabilityBadge[] {
    const fromGroupCapabilities = this.normalizeNumberCapabilities(item.groupCapabilities);
    const numericCaps =
      fromGroupCapabilities.length > 0
        ? fromGroupCapabilities
        : this.normalizeNumberCapabilities(item.capabilities);

    if (numericCaps.length > 0) {
      return numericCaps.map((cap) => this.toCapabilityBadge(cap));
    }

    return [];
  }

  private normalizeNumberCapabilities(raw: unknown): number[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return [...new Set(raw.filter((value): value is number => typeof value === 'number'))];
  }

  private toCapabilityBadge(capability: number): CapabilityBadge {
    const label = this.capabilityLabelByValue.get(capability) ?? this.fallbackCapabilityName(capability);
    return {
      label,
      color: this.capabilityColor(capability),
    };
  }

  private fallbackCapabilityName(capability: number): string {
    const capabilityName = Capability[capability as number];
    if (typeof capabilityName === 'string') {
      return capabilityName;
    }
    return `Capability ${capability}`;
  }

  private capabilityColor(capability: number): StatusBadgeColor {
    switch (capability) {
      case Capability.OWNER:
        return 'red';
      case Capability.DELETE:
        return 'pink';
      case Capability.EDIT:
        return 'orange';
      case Capability.VIEW:
        return 'blue';
      case Capability.ADD:
        return 'green';
      case Capability.EOG_ADJUST_MEMBERS:
        return 'violet';
      case Capability.EOG_ADJUST_CAPABILITIES:
        return 'indigo';
      case Capability.EOG_EDIT_METADATA:
        return 'teal';
      default:
        return 'gray';
    }
  }
}
