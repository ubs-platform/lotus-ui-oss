import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { currencyOptions } from '@lotus/postral-core-frontend/forms';
import { SellerReportGrouping } from '@tk-postral/payment-common';

export const sellerReportPeriods = {
  '7d': { dateGrouping: 'DAILY', reportSize: 7 },
  '15d': { dateGrouping: 'DAILY', reportSize: 15 },
  '1m': { dateGrouping: 'MONTHLY', reportSize: 1 },
  '3m': { dateGrouping: 'MONTHLY', reportSize: 3 },
  '6m': { dateGrouping: 'MONTHLY', reportSize: 6 },
  '1y': { dateGrouping: 'YEARLY', reportSize: 1 },
  '2y': { dateGrouping: 'YEARLY', reportSize: 2 },
  '4y': { dateGrouping: 'YEARLY', reportSize: 4 },
} satisfies Record<string, { dateGrouping: SellerReportGrouping; reportSize: number }>;
export type SellerReportPeriod = keyof typeof sellerReportPeriods;

export const sellerReportMetricLabels = {
  totalSaleAmount: 'postral.seller-series.gross-sales',
  totalRefundAmount: 'postral.seller-series.refunds',
  netSaleAmount: 'postral.seller-series.net-sales',
  netTaxAmount: 'postral.seller-series.net-tax',
  totalExpense: 'postral.seller-series.expenses',
  netRevenueWithoutExpenseTaxed: 'postral.seller-series.after-expenses',
};
export type SellerReportMetric = keyof typeof sellerReportMetricLabels;
export const sellerReportMetrics = Object.entries(sellerReportMetricLabels)
  .map(([value, text]) => ({ text, value }));

@minkyRoot()
export class SellerReportSeriesForm {
  @minky({
    label: 'postral.seller-series.account', inputType: 'select', widthRatio: '50%',
    validators: [new RequiredValidator()],
    selectItems: env => env.parameters.get('accounts'),
  })
  accountId = '';

  @minky({
    label: 'postral.seller-series.currency', inputType: 'select', widthRatio: '50%',
    selectItems: () => currencyOptions,
  })
  currency = 'TRY';

  @minky({
    label: 'postral.seller-series.period', inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => Object.keys(sellerReportPeriods)
      .map(value => ({ text: `postral.seller-series.range-${value}`, value })),
  })
  period: SellerReportPeriod = '7d';

  @minky({
    label: 'postral.seller-series.source', inputType: 'select',
    selectItems: env => env.parameters.get('queries'),
  })
  queryId = '';

  @minky({
    label: 'postral.seller-series.chart-type', inputType: 'select', widthRatio: '50%',
    selectItems: () => [
      { text: 'postral.seller-series.column', value: 'column' },
      { text: 'postral.seller-series.bar', value: 'bar' },
      { text: 'postral.seller-series.line', value: 'line' },
    ],
  })
  chartType: 'column' | 'bar' | 'line' = 'column';

  @minky({
    label: 'postral.seller-series.metric', inputType: 'select', widthRatio: '50%',
    selectItems: () => sellerReportMetrics,
  })
  metric: SellerReportMetric = 'totalSaleAmount';

  @minky({
    label: 'postral.seller-series.skip-unavailable-reports',
    inputType: 'checkbox',
    widthRatio: '100%',
  })
  skipUnavailableReports = false;
}
