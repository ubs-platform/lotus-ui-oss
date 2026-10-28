import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportSetupWizardService } from '@lotus/postral-core-frontend/reports';

import {
  AccountControllerService,
  AddressControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  AccountForm,
} from '@lotus/postral-core-frontend/forms';
import { AccountDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { throwError } from 'rxjs';
@Component({
  selector: 'lib-account-user-info',
  standalone: false,
  templateUrl: './account-user-info.component.html',
  styleUrl: './account-user-info.component.scss',
})
export class AccountUserInfoComponent {
  private readonly setupWizard = inject(ReportSetupWizardService);
  private readonly destroyRef = inject(DestroyRef);
  readonly savedAccount = signal<AccountDTO | null>(null);
  readonly canSetupReports = signal(false);
  instruction = signal<FormEditInstruction<AccountDTO, AccountDTO> | null>(null);
  accountId = signal<string>('');
  /**
   *
   */
  constructor(
    private accountService: AccountControllerService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private addressService: AddressControllerService,
    private router: Router,
    private publisherTeamService: PublisherTeamService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const accountId = params['id'];
      this.savedAccount.set(null);
      this.canSetupReports.set(false);
      if (accountId === 'new' || accountId === 'create') {
        this.accountId.set(accountId);
        this.generateForm(new AccountDTO());
        return;
      }
      this.accountService.get(accountId).subscribe((data) => {
        this.accountId.set(data.id || '');
        this.updateReportSetupAccount(data);
        this.generateForm(data);
      });
    });
  }

  setupReports(): void {
    const account = this.savedAccount();
    if (!account || !this.canSetupReports()) return;
    this.setupWizard.open({ account }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private updateReportSetupAccount(account: AccountDTO): void {
    this.savedAccount.set(account);
    const customerMode = this.activatedRoute.pathFromRoot.some(route => route.snapshot.data['paymentMode'] === 'customer');
    this.canSetupReports.set(!customerMode && account.type === 'COMMERCIAL' && !account.isExternal && !account.deactivated);
  }

  private generateForm(data: AccountDTO) {
    const form = new Reform(AccountForm, data);

    // Eğer kişisel hesap seçildiyse takım seçimi gerekli olacak şekilde işaretle
    form.valueUpdate.subscribe((formValue) => {
      this.instruction.update((a) => {
        if (a == null) {
          return a;
        }
        a.teamSelectionRequired = formValue.type === "COMMERCIAL";
        return a;
      });
    });

    this.instruction.set({
      extraActions:[
        {
          renderIf: () => this.canSetupReports(),
          action: () => this.setupReports(),
          stringContent: 'postral.report-setup.configure'
        }
      ],
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert(
          'Validation Error',
          'Please check the form for errors and try again.',
          'error'
        );
      },
      beforeSave: (form: Reform) => true,
      teamSelectionRequired: (data) => !data.id,
      teamSelectionDialog: {
        title: 'Takım seçimi',
        description:
          'Yeni hesap için sahip belirtilmesi gerekiyor. Bunu sonradan değiştiremezsiniz, bu nedenle doğru seçtiğinizden emin olun.',
      },
      onTeamSelected: (result, data) => {
        data.entityOwnershipGroupId = result.usePersonalInsteadTeam
          ? undefined
          : result.selectedTeamId;
      },
      saveMethod: (data) => {
        if (data.id) {
          data.entityOwnershipGroupId = this.publisherTeamService.getActiveTeamId()!;
          return this.accountService.update(data);
        }
        if (data.entityOwnershipGroupId && data.type === 'INDIVIDUAL') {
          const msg = 'Kişisel hesaplar bir takıma (varlık sahipliği grubuna) sahip olmamalıdır.';
          this.basicOverlay.alert(
            'general.error',
            msg,
            'error'
          );
          return throwError(() => new Error(msg));
        }
        return this.accountService.create(data);
      },
      afterSaveSuccess: async (out, data) => {
        this.basicOverlay.alert(
          'Success',
          'postral.account-information-updated-su',
          'success'
        );
        const isNew = this.accountId() === 'new' || this.accountId() === 'create';
        this.updateReportSetupAccount(out);
        if (isNew) {
          const shouldSetup = this.canSetupReports();
          const navigated = await this.router.navigate(['..', out.id], { relativeTo: this.activatedRoute, replaceUrl: true });
          if (navigated && shouldSetup) {
            this.setupWizard.open({ account: out }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          }
          return;
        }
        this.instruction.update((a) => {
          if (a) {
            //   // const form = new Reform(AccountForm);
            form.patchValue(out);
            //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { },
    });
  }
}
