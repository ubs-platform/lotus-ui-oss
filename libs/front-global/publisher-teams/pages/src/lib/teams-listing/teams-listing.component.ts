import { Component, computed, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthManagementService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { Optional } from '@ubs-platform/crud-base-common/utils';
import { Capability, EntityOwnershipGroupCommonDTO, UserDTO } from '@ubs-platform/users-common';
import { SearchResult } from '@ubs-platform/crud-base-common';
@Component({
  selector: 'lib-teams-listing',
  standalone: false,
  templateUrl: './teams-listing.component.html',
  styleUrl: './teams-listing.component.scss',
})
export class TeamsListingComponent {

  adminMode = signal<boolean>(false);
  adminModeString = computed(() => (this.adminMode() ? 'true' : 'false'));
  teams = signal<EntityOwnershipGroupCommonDTO[]>([]);
  dataTable = viewChild<SearchableDataTableComponent>('dataTable');
  eogTrusted = signal<{ [eogId: string]: boolean }>({});
  currentUser = signal<Optional<UserDTO>>(null);

  constructor(
    private publisherTeamService: PublisherTeamService,
    private activatedRoute: ActivatedRoute,
    private overlay: BasicOverlayService,
    private authManagement: AuthManagementService
  ) {
    this.authManagement.userChange().subscribe((user) => {
      this.currentUser.set(user);
    });
  }



  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.adminMode.set(data['admin']);
      // this.publisherTeamService.getAll({}).subscribe((data) => {
      //   this.teams.set(data);
      // });
    });
  }

  createNewTeam() {
    const teamNameInitial = `${this.currentUser()?.name} ${this.currentUser()?.surname}'in takımı`;
    this.publisherTeamService
      .getAll({ name: teamNameInitial })
      .subscribe((data) => {
        let name = teamNameInitial;
        data.filter((t) => t.name.includes(name)).length;
        if (data.length > 0) {
          name = `${teamNameInitial} (${data.length})`;
        }

        this.publisherTeamService
          .create({
            name: name,
            description:
              'Daha fazla bilgi için açıklama alanını ayarlarda doldurabilirsiniz.',
            initialUserEntityCapabilities: [
              {
                entityGroup: 'LOTUS_QB',
                entityName: 'QUESTION_BOOK',
                capability: 'OWNER',
                capabilities: [Capability.OWNER]
              },
              {
                entityGroup: 'POSTRAL',
                entityName: 'ACCOUNT',
                capability: 'OWNER',
                capabilities: [Capability.OWNER]
              },
            ],
          })
          .subscribe((data) => {
            const currentTeams = this.teams();
            currentTeams.push(data);
            this.dataTable()?.loadData();
          });
      });
  }

  deleteTeam(_t22: any) {
    this.overlay
      .confirm('Takımı sil', 'Takım silindiğinde geri alınamaz. Bu takımı silmek istediğinize emin misiniz?')
      .subscribe((confirmed) => {
        if (confirmed === false) {
          return;
        }
        this.publisherTeamService.delete(_t22.id!).subscribe({
          next: () => {
            // const currentTeams = this.teams().filter((t) => t.id! !== _t22.id);
            // this.teams.set(currentTeams);
            this.dataTable()?.loadData();
          }, error: error => {
            this.overlay.alert('Hata', 'Yayıncı takımı silinirken bir hata oluştu: ' + error.error.message, 'error');
            console.error('Error deleting team:', error);
          }
        });
      });
  }

  fetchEogTrustStatusByTeams(eogs: SearchResult<EntityOwnershipGroupCommonDTO>) {
    const eogIds = eogs.content.map((team) => team.id!);
    this.fetchEogTrustStatus(eogIds);
  }

  fetchEogTrustStatus(eogIds: string[]) {
    for (const eogId of eogIds) {
      this.publisherTeamService.getEogTrustedStatus(eogId).subscribe({
        next: (status) => {
          this.setEogTrustStatus(eogId, status);
        },
        error: (err) => {
          console.error('Error fetching EOG trust status:', err);
        }
      });
    }
  }
  private setEogTrustStatus(eogId: string, status: boolean) {
    this.eogTrusted.set({
      ...this.eogTrusted(),
      [eogId]: status,
    });
  }

  setEogTrusted(eogId: string, isTrusted: boolean) {
    this.publisherTeamService.setEogTrusted(eogId, isTrusted).subscribe({
      next: () => {
        // this.dataTable()?.loadData();
        this.setEogTrustStatus(eogId, isTrusted);

        this.overlay.alert("Başarılı", `Yayıncı takımı ${isTrusted ? 'güvenilir' : 'güvenilir değil'} olarak ayarlandı.`, "success");
      },
      error: (err) => {
        console.error('Error setting EOG trust status:', err);
      }
    });
  }
}
