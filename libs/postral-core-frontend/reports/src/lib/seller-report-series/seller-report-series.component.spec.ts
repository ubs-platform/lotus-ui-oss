import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { AccountControllerService, ReportControllerService } from '@lotus/postral-core-frontend/client';
import { ReportDTO, SellerReportSeriesDTO } from '@tk-postral/payment-common';
import { Subject, of, throwError } from 'rxjs';
import { SellerReportSeriesComponent } from './seller-report-series.component';
import { SellerReportPeriod } from './seller-report-series.form';
import { ReportSetupWizardService } from '../report-setup/report-setup-wizard.service';

describe('SellerReportSeriesComponent', () => {
  const accounts = { getAll: jest.fn() };
  const reports = { sellerSeries: jest.fn() };
  const wizard = { open: jest.fn() };
  const route = { pathFromRoot: [{ snapshot: { data: { paymentMode: 'seller' } } }] };
  let component: SellerReportSeriesComponent;
  const response = (): SellerReportSeriesDTO => ({
    accountId: 'seller', currency: 'TRY', dateGrouping: 'DAILY', reportSize: 7,
    queries: [{ id: 'source', name: 'Daily', reportType: 'SELLER', dateGrouping: 'DAILY' }],
    selectedQueryId: 'source',
    periods: [
      { periodLabel: '2026-10-15', isCurrentPeriod: false, report: null },
      {
        periodLabel: '2026-10-16', isCurrentPeriod: true,
        report: Object.assign(new ReportDTO(), {
          id: 'report', totalSaleAmount: 200, totalRefundAmount: 50, netSaleAmount: 150,
          netTaxAmount: 30, totalExpense: 20, netRevenueWithoutExpense: 100,
        }),
      },
    ],
    hasPendingRecords: false, hasFailedRecords: false, generatedAt: '2026-10-16T00:00:00Z',
  });
  const form = () => {
    const instruction = component.instruction();
    if (!instruction) throw new Error('Expected filter form');
    return instruction.form;
  };
  const initialize = () => {
    component = TestBed.runInInjectionContext(() => new SellerReportSeriesComponent());
    component.ngOnInit();
    tick();
  };

  beforeEach(() => {
    jest.resetAllMocks();
    route.pathFromRoot[0].snapshot.data.paymentMode = 'seller';
    accounts.getAll.mockReturnValue(of([
      { id: 'seller', name: 'Seller' },
      { id: 'external', name: 'External', isExternal: true },
      { id: 'inactive', name: 'Inactive', deactivated: true },
    ]));
    reports.sellerSeries.mockReturnValue(of(response()));
    wizard.open.mockReturnValue(of(true));
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountControllerService, useValue: accounts },
        { provide: ReportControllerService, useValue: reports },
        { provide: ActivatedRoute, useValue: route },
        { provide: BasicOverlayService, useValue: { alert: jest.fn() } },
        { provide: ReportSetupWizardService, useValue: wizard },
      ],
    });
  });

  it('opens setup for the selected account/currency and refreshes after completion', fakeAsync(() => {
    initialize();
    component.setupReports();
    tick();
    expect(wizard.open).toHaveBeenCalledWith({ accountId: 'seller', currency: 'TRY' });
    expect(reports.sellerSeries).toHaveBeenCalledTimes(2);
  }));

  it('does not refresh after cancellation or open setup in customer mode', fakeAsync(() => {
    initialize();
    wizard.open.mockReturnValue(of(false));
    component.setupReports();
    tick();
    expect(reports.sellerSeries).toHaveBeenCalledTimes(1);
    wizard.open.mockClear();
    component.customerMode.set(true);
    component.setupReports();
    expect(wizard.open).not.toHaveBeenCalled();
  }));

  it('loads owned commercial accounts and auto-selects the only available account', fakeAsync(() => {
    initialize();
    expect(accounts.getAll).toHaveBeenCalledWith({ admin: 'false', type: 'COMMERCIAL', deactivated: 'NOT_DEACTIVATED' });
    expect(form().getParameterMap().get('accounts')).toEqual([{ value: 'seller', text: 'Seller' }]);
    expect(reports.sellerSeries).toHaveBeenCalledWith({
      accountId: 'seller', currency: 'TRY', dateGrouping: 'DAILY', reportSize: 7,
    });
  }));

  it('does not initialize accounts or reports in customer mode', fakeAsync(() => {
    route.pathFromRoot[0].snapshot.data.paymentMode = 'customer';
    initialize();
    expect(component.customerMode()).toBe(true);
    expect(accounts.getAll).not.toHaveBeenCalled();
    expect(reports.sellerSeries).not.toHaveBeenCalled();
  }));

  it('requests only available reports when checked and restores gaps when unchecked', fakeAsync(() => {
    initialize();
    expect(form().value.skipUnavailableReports).toBe(false);
    const available = response();
    available.periods = available.periods.filter(period => period.report !== null);
    reports.sellerSeries.mockReturnValueOnce(of(available));
    form().patchValue({ skipUnavailableReports: true });
    tick();
    expect(reports.sellerSeries).toHaveBeenLastCalledWith({
      accountId: 'seller', currency: 'TRY', dateGrouping: 'DAILY', reportSize: 7,
      skipUnavailableReports: true,
    });
    expect(component.chartData().labels).toEqual(['2026-10-16 *']);
    expect(component.compositionChartData().labels).toEqual(['2026-10-16 *']);
    expect(component.series()?.periods).toHaveLength(1);
    form().patchValue({ skipUnavailableReports: false });
    tick();
    expect(reports.sellerSeries).toHaveBeenLastCalledWith({
      accountId: 'seller', currency: 'TRY', dateGrouping: 'DAILY', reportSize: 7,
    });
    expect(component.series()?.periods).toHaveLength(2);
  }));

  it('waits for an explicit selection when several accounts are available', fakeAsync(() => {
    accounts.getAll.mockReturnValue(of([{ id: 'one', name: 'One' }, { id: 'two', name: 'Two' }]));
    initialize();
    expect(reports.sellerSeries).not.toHaveBeenCalled();
    form().patchValue({ accountId: 'two' });
    tick();
    expect(reports.sellerSeries).toHaveBeenCalledWith(expect.objectContaining({ accountId: 'two' }));
  }));

  it('preserves gaps as null and changes chart type or metric without fetching again', fakeAsync(() => {
    initialize();
    expect(form().value.metric).toBe('totalSaleAmount');
    expect(component.chartData().datasets[0].data).toEqual([null, 200]);
    form().patchValue({ chartType: 'bar', metric: 'totalSaleAmount' });
    tick();
    expect(component.chartOptions().indexAxis).toBe('y');
    expect(component.chartData().datasets[0].data).toEqual([null, 200]);
    form().patchValue({ metric: 'netSaleAmount' });
    tick();
    expect(component.chartData().datasets[0].data).toEqual([null, 150]);
    form().patchValue({ chartType: 'line' });
    tick();
    expect(component.chartType()).toBe('line');
    expect(component.chartData().datasets[0]).toMatchObject({ spanGaps: false });
    expect(reports.sellerSeries).toHaveBeenCalledTimes(1);
  }));

  it('shows net earnings, tax and expenses as a 100% stacked net-sales breakdown', fakeAsync(() => {
    initialize();
    expect(component.compositionChartData().datasets.map(dataset => dataset.label)).toEqual([
      'postral.seller-series.net-earnings',
      'postral.seller-series.net-tax',
      'postral.seller-series.expenses',
    ]);
    expect(component.compositionChartData().datasets.map(dataset => dataset.data)).toEqual([
      [null, 100 / 150 * 100],
      [null, 30 / 150 * 100],
      [null, 20 / 150 * 100],
    ]);
    expect(component.compositionChartOptions().scales?.['y']).toMatchObject({ stacked: true, max: 100 });
    expect(component.compositionChartData().datasets.map(dataset => dataset.backgroundColor)).toEqual([
      '#22c55e', '#3b82f6', '#f97316',
    ]);
  }));

  it('does not cancel an active HTTP request on a presentation-only change', fakeAsync(() => {
    const pending = new Subject<SellerReportSeriesDTO>();
    reports.sellerSeries.mockReturnValue(pending);
    initialize();
    form().patchValue({ metric: 'totalSaleAmount' });
    tick();
    pending.next(response());
    expect(component.series()?.accountId).toBe('seller');
    expect(component.loading()).toBe(false);
    expect(reports.sellerSeries).toHaveBeenCalledTimes(1);
  }));

  it('cancels stale responses and clears data when the account is cleared', fakeAsync(() => {
    const old = new Subject<SellerReportSeriesDTO>();
    const current = new Subject<SellerReportSeriesDTO>();
    reports.sellerSeries.mockReturnValueOnce(old).mockReturnValueOnce(current);
    initialize();
    form().patchValue({ accountId: 'other' });
    tick();
    old.next(response());
    expect(component.series()).toBeNull();
    current.next({ ...response(), accountId: 'other' });
    expect(component.series()?.accountId).toBe('other');
    form().patchValue({ accountId: '' });
    tick();
    current.next({ ...response(), accountId: 'other' });
    expect(component.series()).toBeNull();
    expect(component.loading()).toBe(false);
  }));

  it('resets the source when switching grouping or currency', fakeAsync(() => {
    initialize();
    form().patchValue({ queryId: 'source', period: '1m' });
    tick();
    expect(form().value.queryId).toBe('');
    expect(reports.sellerSeries).toHaveBeenLastCalledWith({
      accountId: 'seller', currency: 'TRY', dateGrouping: 'MONTHLY', reportSize: 1,
    });
    form().patchValue({ queryId: 'source', currency: 'USD' });
    tick();
    expect(reports.sellerSeries).toHaveBeenLastCalledWith(expect.objectContaining({ currency: 'USD' }));
    expect(form().value.queryId).toBe('');
  }));

  it.each<[SellerReportPeriod, string, number]>([
    ['7d', 'DAILY', 7], ['15d', 'DAILY', 15],
    ['1m', 'MONTHLY', 1], ['3m', 'MONTHLY', 3], ['6m', 'MONTHLY', 6],
    ['1y', 'YEARLY', 1], ['2y', 'YEARLY', 2], ['4y', 'YEARLY', 4],
  ])('maps %s to the exact source grouping and count', (period, dateGrouping, reportSize) => {
    fakeAsync(() => {
      initialize();
      form().patchValue({ period });
      tick();
      expect(reports.sellerSeries).toHaveBeenLastCalledWith({
        accountId: 'seller', currency: 'TRY', dateGrouping, reportSize,
      });
    })();
  });

  it('preserves an explicit source when changing only the count within a grouping', fakeAsync(() => {
    initialize();
    form().patchValue({ queryId: 'source' });
    tick();
    form().patchValue({ period: '15d' });
    tick();
    expect(reports.sellerSeries).toHaveBeenLastCalledWith(expect.objectContaining({
      queryId: 'source', dateGrouping: 'DAILY', reportSize: 15,
    }));
  }));

  it('offers creation with the selected filters when no source exists', fakeAsync(() => {
    reports.sellerSeries.mockReturnValue(of({
      ...response(), queries: [], selectedQueryId: undefined, periods: [],
    }));
    initialize();
    form().patchValue({ currency: 'EUR', period: '3m' });
    tick();
    expect(component.series()?.queries).toEqual([]);
    expect(component.queryCreateParams()).toEqual({
      ownerAccountId: 'seller', currency: 'EUR', dateGrouping: 'MONTHLY',
    });
  }));

  it('sends an explicitly selected query without merging sources', fakeAsync(() => {
    reports.sellerSeries.mockReturnValue(of({
      ...response(), selectedQueryId: undefined, periods: [],
      queries: [...response().queries, { ...response().queries[0], id: 'other', name: 'Other' }],
    }));
    initialize();
    expect(component.hasData()).toBe(false);
    form().patchValue({ queryId: 'other' });
    tick();
    expect(reports.sellerSeries).toHaveBeenLastCalledWith(expect.objectContaining({ queryId: 'other' }));
  }));

  it('surfaces HTTP errors and retries without resetting filters', fakeAsync(() => {
    reports.sellerSeries.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    initialize();
    expect(component.error()).toBe('postral.seller-series.load-error');
    expect(component.series()).toBeNull();
    component.retry();
    tick();
    expect(component.error()).toBe('');
    expect(component.series()).not.toBeNull();
    expect(reports.sellerSeries).toHaveBeenCalledTimes(2);
  }));

  it('surfaces account load errors and allows retry', fakeAsync(() => {
    accounts.getAll.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    initialize();
    expect(component.error()).toBe('postral.seller-series.accounts-error');
    component.retry();
    tick();
    expect(component.instruction()).not.toBeNull();
    expect(component.error()).toBe('');
  }));

  it('shows the no-account state without requesting reports', fakeAsync(() => {
    accounts.getAll.mockReturnValue(of([]));
    initialize();
    expect(component.noAccounts()).toBe(true);
    expect(reports.sellerSeries).not.toHaveBeenCalled();
  }));
});
