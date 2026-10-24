import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BehaviorSubject, EMPTY, Subject, auditTime, catchError, filter, map, merge, startWith, switchMap } from 'rxjs';
import { FeederItem, Reform } from '@lotus/front-global/minky/core';
import { FormEditInstruction, ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { ChartComponent } from '@lotus/front-global/chart';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { AccountControllerService, ReportControllerService } from '@lotus/postral-core-frontend/client';
import { ReportDTO, SellerReportSeriesDTO, SellerReportSeriesSearchDTO } from '@tk-postral/payment-common';
import { SellerReportSeriesForm, sellerReportMetricLabels, sellerReportPeriods } from './seller-report-series.form';
import { PostralReportsModule } from '../postral-reports.module';
import { ReportSetupWizardService } from '../report-setup/report-setup-wizard.service';

@Component({
  selector: 'lib-seller-report-series',
  imports: [
    RouterModule, ReformDataEditComponent, ChartComponent, FrontGlobalButtonModule,
    UbsTranslatorNgxModule, PostralReportsModule,
  ],
  templateUrl: './seller-report-series.component.html',
  styleUrl: './seller-report-series.component.scss',
})
export class SellerReportSeriesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly accounts = inject(AccountControllerService);
  private readonly reports = inject(ReportControllerService);
  private readonly overlay = inject(BasicOverlayService);
  private readonly setupWizard = inject(ReportSetupWizardService);
  private readonly reload = new Subject<void>();
  private readonly queries = new BehaviorSubject<FeederItem[]>([]);
  private lastScope = '';
  private lastRequest = '';

  readonly instruction = signal<FormEditInstruction<SellerReportSeriesForm, void> | null>(null);
  readonly filters = signal(new SellerReportSeriesForm());
  readonly series = signal<SellerReportSeriesDTO | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly noAccounts = signal(false);
  readonly customerMode = signal(false);
  readonly metricLabel = computed(() => sellerReportMetricLabels[this.filters().metric]);
  readonly queryCreateParams = computed(() => ({
    ownerAccountId: this.filters().accountId,
    currency: this.filters().currency,
    dateGrouping: sellerReportPeriods[this.filters().period].dateGrouping,
  }));
  readonly hasData = computed(() => this.series()?.periods.some(period => period.report !== null) ?? false);
  readonly chartType = computed(() => this.filters().chartType === 'line' ? 'line' : 'bar');
  readonly chartData = computed<ChartData>(() => ({
    labels: this.series()?.periods.map(period => `${period.periodLabel}${period.isCurrentPeriod ? ' *' : ''}`) ?? [],
    datasets: [{
      label: this.series()?.currency ?? '',
      data: this.series()?.periods.map(period => period.report?.[this.filters().metric] ?? null) ?? [],
      spanGaps: false,
    }],
  }));
  readonly chartOptions = computed<ChartOptions>(() => ({
    indexAxis: this.filters().chartType === 'bar' ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  }));
  readonly compositionChartData = computed<ChartData<'bar'>>(() => {
    const periods = this.series()?.periods ?? [];
    const reports = periods.map(period => period.report);
    return {
      labels: periods.map(period => `${period.periodLabel}${period.isCurrentPeriod ? ' *' : ''}`),
      datasets: [
        {
          label: 'postral.seller-series.net-earnings',
          data: reports.map(report => this.compositionPercent(report, report?.netRevenueWithoutExpense)),
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
        },
        {
          label: 'postral.seller-series.net-tax',
          data: reports.map(report => this.compositionPercent(report, report?.netTaxAmount)),
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6',
        },
        {
          label: 'postral.seller-series.expenses',
          data: reports.map(report => this.compositionPercent(report, report?.totalExpense)),
          backgroundColor: '#f97316',
          borderColor: '#f97316',
        },
      ],
    };
  });
  readonly compositionChartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: { callback: value => `${value}%` },
      },
    },
    plugins: { legend: { display: true, position: 'bottom' } },
  }));

  ngOnInit(): void {
    if (this.route.pathFromRoot.some(route => route.snapshot.data['paymentMode'] === 'customer')) {
      this.customerMode.set(true);
      this.loading.set(false);
      return;
    }
    this.loadAccounts();
  }

  retry(): void {
    if (!this.instruction()) this.loadAccounts();
    else this.reload.next();
  }

  setupReports(): void {
    if (this.customerMode() || !this.filters().accountId) return;
    this.setupWizard.open({ accountId: this.filters().accountId, currency: this.filters().currency })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(completed => {
        if (completed) this.reload.next();
      });
  }

  private loadAccounts(): void {
    this.error.set('');
    this.loading.set(true);
    this.accounts.getAll({ admin: 'false', type: 'COMMERCIAL', deactivated: 'NOT_DEACTIVATED' })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: accounts => {
          const sellers = accounts.filter(account => !account.isExternal && !account.deactivated);
          this.noAccounts.set(sellers.length === 0);
          this.loading.set(false);
          if (!sellers.length) return;
          const initial = new SellerReportSeriesForm();
          if (sellers.length === 1) initial.accountId = sellers[0].id;
          const form = new Reform(SellerReportSeriesForm, initial, {
            parameters: {
              accounts: sellers.map(seller => ({ value: seller.id, text: seller.name })),
              queries: this.queries,
            },
          });
          form.setHiddenByPath('queryId', true);
          this.instruction.set({
            form,
            onValidationError: () => this.overlay.alert('general.error', 'postral.seller-series.choose-account', 'error'),
            saveMethod: () => this.retry(),
            afterSaveSuccess: () => undefined,
            afterSaveError: () => this.overlay.alert('general.error', 'postral.seller-series.load-error', 'error'),
          });
          this.watchFilters(form);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('postral.seller-series.accounts-error');
        },
      });
  }

  private watchFilters(form: Reform<SellerReportSeriesForm>): void {
    merge(
      form.valueUpdate.pipe(startWith(form.value), map(() => false)),
      this.reload.pipe(map(() => true)),
    ).pipe(
      auditTime(0),
      map(force => {
        const value = form.value;
        const period = sellerReportPeriods[value.period];
        const scope = JSON.stringify([value.accountId, value.currency, period.dateGrouping]);
        if (scope !== this.lastScope) {
          form.patchValue({ queryId: '' });
          this.queries.next([]);
          form.setHiddenByPath('queryId', true);
          this.lastScope = scope;
        }
        this.filters.set({ ...value });
        const request: SellerReportSeriesSearchDTO | null = value.accountId ? {
          accountId: value.accountId,
          currency: value.currency,
          dateGrouping: period.dateGrouping,
          reportSize: period.reportSize,
          ...(value.queryId ? { queryId: value.queryId } : {}),
          ...(value.skipUnavailableReports ? { skipUnavailableReports: true } : {}),
        } : null;
        return { request, force };
      }),
      filter(({ request, force }) => {
        const key = JSON.stringify(request);
        if (!force && key === this.lastRequest) return false;
        this.lastRequest = key;
        return true;
      }),
      switchMap(({ request }) => {
        this.series.set(null);
        this.error.set('');
        this.loading.set(request !== null);
        if (!request) return EMPTY;
        return this.reports.sellerSeries(request).pipe(
          catchError(() => {
            this.loading.set(false);
            this.error.set('postral.seller-series.load-error');
            return EMPTY;
          }),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(series => {
      this.series.set(series);
      this.loading.set(false);
      this.queries.next(series.queries.map(query => ({ text: query.name, value: query.id })));
      form.setHiddenByPath('queryId', series.queries.length <= 1);
    });
  }

  private compositionPercent(report: ReportDTO | null, amount: number | undefined): number | null {
    if (
      !report
      || !Number.isFinite(report.netSaleAmount)
      || report.netSaleAmount <= 0
      || !Number.isFinite(report.netRevenueWithoutExpense)
      || report.netRevenueWithoutExpense < 0
      || !Number.isFinite(report.netTaxAmount)
      || report.netTaxAmount < 0
      || !Number.isFinite(report.totalExpense)
      || report.totalExpense < 0
      || amount === undefined
    ) return null;
    return amount / report.netSaleAmount * 100;
  }
}
