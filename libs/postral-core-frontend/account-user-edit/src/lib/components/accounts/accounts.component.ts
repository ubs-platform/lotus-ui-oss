import { Component, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDTO } from '@tk-postral/payment-common';
import {
  AccountControllerService,
  AccountUserControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';

@Component({
  selector: 'postral-core-accounts',
  standalone: false,
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent {
  accounts = signal<AccountDTO[]>([]);
  admin = signal<boolean>(false);
  table = viewChild<SearchableDataTableComponent>('table');
  constructor(
    private accountAdminService: AccountControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private teamService: PublisherTeamService
  ) {}

  deactivateAccount(arg0: any) {
    this.basicOverlay
      .confirm(
        'Hesabı devre dışı bırak',
        'Hesabı devre dışı bırakmak istediğinize emin misiniz?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.accountAdminService.delete(arg0).subscribe(() => {
            this.table()?.loadData();
          });
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      // console.log(data);
      if (data['admin']) {
        this.admin.set(true);
      }
    });
  }

  createAccount() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
