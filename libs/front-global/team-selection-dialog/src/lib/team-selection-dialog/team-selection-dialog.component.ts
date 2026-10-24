import { Component, signal } from '@angular/core';
import {
  CustomSelectComponent,
  Option,
} from '@lotus/legendary-front/custom-select';
import { Inject } from '@angular/core';
import {
  WebdialogReference,
  WEBDIALOG_CONFIG,
  IWebDialogConfig,
} from '@lotus/front-global/webdialog';
import {
  ReformDialogData,
  BasicOverlayService,
} from '@lotus/front-global/prompt-overlays';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
export class TeamSelectionDialogData {
  description?: string;
  // Define any properties needed for the dialog data here
}

export class TeamSelectionResult {
  selectedTeamId?: string;
  usePersonalInsteadTeam?: boolean;
}

@Component({
  selector: 'lib-team-selection-dialog',
  imports: [CustomSelectComponent, FrontGlobalButtonModule],
  templateUrl: './team-selection-dialog.component.html',
  styleUrl: './team-selection-dialog.component.css',
})
export class TeamSelectionDialogComponent {
  selectItems = signal<Option[]>([]);
  selectedTeam = signal<TeamSelectionResult | undefined>(undefined);

  constructor(
    public dial: WebdialogReference<TeamSelectionResult | undefined>,
    @Inject(WEBDIALOG_CONFIG)
    public dialogConfig: IWebDialogConfig<
      TeamSelectionDialogData,
      TeamSelectionResult | undefined
    >,
    private overlay: BasicOverlayService,
    private publisherTeamService: PublisherTeamService,
  ) {
    const activeTeamId = this.publisherTeamService.getActiveTeamId();
    if (activeTeamId) {
      this.selectedTeam.set({ selectedTeamId: activeTeamId });
    }

    this.publisherTeamService.getAll().subscribe((teams) => {
      console.log(teams);
      this.selectItems.set([
        ...teams.map((team) => ({
          text: team.name,
          value: { selectedTeamId: team.id } as TeamSelectionResult,
        })),

        {
          text: 'general.personal-account',
          value: { usePersonalInsteadTeam: true } as TeamSelectionResult,
        },
      ]);
    });
  }

  close(result?: TeamSelectionResult) {
    this.dial.close(result);
  }
}
