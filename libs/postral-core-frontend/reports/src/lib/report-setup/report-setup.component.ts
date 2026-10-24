import { Component, DestroyRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, distinctUntilChanged, finalize, map, merge, startWith, switchMap, throwError } from 'rxjs';
import { AccountControllerService } from '@lotus/postral-core-frontend/client';
import { AccountDTO, SELLER_REPORT_SETUP_GROUPINGS, SellerReportSetupGrouping, SellerReportSetupResultDTO } from '@tk-postral/payment-common';
import { Reform } from '@lotus/front-global/minky/core';
import { FormEditInstruction, ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { IWebDialogConfig, WEBDIALOG_CONFIG, WebdialogReference } from '@lotus/front-global/webdialog';
import { ReportSetupForm } from './report-setup.form';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

export interface ReportSetupDialogData {
  account?: AccountDTO;
  accountId?: string;
  currency?: string;
}

@Component({
  selector: 'lib-report-setup',
  imports: [ReformDataEditComponent, FrontGlobalButtonModule, UbsTranslatorNgxModule],
  templateUrl: './report-setup.component.html',
})
export class ReportSetupComponent implements OnInit {
  private readonly accounts = inject(AccountControllerService);
  private readonly overlay = inject(BasicOverlayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject<WebdialogReference<boolean>>(WebdialogReference);
  private readonly config = inject<IWebDialogConfig<ReportSetupDialogData, boolean>>(WEBDIALOG_CONFIG);
  private readonly reload = new Subject<void>();
  readonly instruction = signal<FormEditInstruction<ReportSetupForm, SellerReportSetupResultDTO> | null>(null);
  readonly preview = signal<SellerReportSetupResultDTO | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly groupings = SELLER_REPORT_SETUP_GROUPINGS;
  readonly editor = viewChild(ReformDataEditComponent);
  readonly groupingLabels: Record<SellerReportSetupGrouping, string> = {
    DAILY: 'postral.report-setup.daily', MONTHLY: 'postral.report-setup.monthly', YEARLY: 'postral.report-setup.yearly',
  };

  ngOnInit(): void {
    this.loadAccounts();
  }

  retry(): void {
    if (this.instruction()) this.reload.next();
    else this.loadAccounts();
  }

  cancel(): void {
    if (!this.saving()) this.dialog.close(false);
  }

  private loadAccounts(): void {
    this.loading.set(true);
    this.error.set('');
    this.accounts.getAll({ admin: 'false', type: 'COMMERCIAL', deactivated: 'NOT_DEACTIVATED' })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: accounts => {
          const eligible = accounts.filter(account => !account.isExternal && !account.deactivated);
          const fixedId = this.config.data?.account?.id ?? this.config.data?.accountId;
          const available = fixedId ? eligible.filter(account => account.id === fixedId) : eligible;
          if (!available.length) {
            this.loading.set(false);
            this.error.set('postral.report-setup.no-accounts');
            return;
          }
          const initial = new ReportSetupForm();
          initial.accountId = fixedId ?? (available.length === 1 ? available[0].id : '');
          initial.currency = this.config.data?.currency ?? 'TRY';
          const form = new Reform(ReportSetupForm, initial, {
            parameters: { accounts: available.map(account => ({ value: account.id, text: account.name })) },
          });
          if (fixedId) form.setDisableByPath('accountId', true);
          this.initializeForm(form);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('postral.report-setup.accounts-error');
        },
      });
  }

  private initializeForm(form: Reform<ReportSetupForm>): void {
    this.instruction.set({
      form,
      onValidationError: () => this.overlay.alert('general.error', 'postral.report-setup.choose-account', 'error'),
      beforeSave: () => !this.saving(),
      saveMethod: data => {
        const preview = this.preview();
        if (this.saving() || this.loading() || this.error() || !preview ||
          preview.accountId !== data.accountId || preview.currency !== data.currency) {
          return throwError(() => new Error('Report setup preview is not ready'));
        }
        this.setSaving(form, true);
        const dateGroupings: SellerReportSetupGrouping[] = ['DAILY'];
        if (data.monthly) dateGroupings.push('MONTHLY');
        if (data.yearly) dateGroupings.push('YEARLY');
        return this.accounts.setupReports(data.accountId, { currency: data.currency, dateGroupings })
          .pipe(finalize(() => this.setSaving(form, false)));
      },
      afterSaveSuccess: result => {
        this.overlay.alert('postral.report-setup.complete', {
          key: 'postral.report-setup.result',
          parameters: { created: result.created.length, existing: result.existing.length },
        }, 'success');
        this.dialog.close(true);
      },
      afterSaveError: () => {
        this.error.set('postral.report-setup.save-error');
      },
    });
    merge(
      form.valueUpdate.pipe(startWith(form.value), map(() => [form.value.accountId, form.value.currency] as const),
        distinctUntilChanged(([oldId, oldCurrency], [id, currency]) => oldId === id && oldCurrency === currency)),
      this.reload.pipe(map(() => [form.value.accountId, form.value.currency] as const)),
    ).pipe(
      switchMap(([accountId, currency]) => {
        this.preview.set(null);
        this.error.set('');
        this.loading.set(!!accountId);
        if (!accountId) return EMPTY;
        return this.accounts.previewReportSetup(accountId, currency).pipe(catchError(() => {
          this.loading.set(false);
          this.error.set('postral.report-setup.preview-error');
          return EMPTY;
        }));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(preview => {
      this.preview.set(preview);
      this.loading.set(false);
    });
  }

  private setSaving(form: Reform<ReportSetupForm>, saving: boolean): void {
    this.saving.set(saving);
    const fixedAccount = !!(this.config.data?.account?.id ?? this.config.data?.accountId);
    for (const path of ['accountId', 'currency', 'monthly', 'yearly']) {
      form.setDisableByPath(path, saving || (path === 'accountId' && fixedAccount));
    }
  }
}
