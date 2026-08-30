import { ReportDateGrouping, ReportType } from "@tk-postral/payment-common";

export const accountTypes = [
  { text: 'Kişisel', value: 'INDIVIDUAL' },
  { text: 'Ticari', value: 'COMMERCIAL' },
];

export const currencyOptions = [
  { text: 'TRY', value: 'TRY' },
  { text: 'USD', value: 'USD' },
  { text: 'Euro', value: 'EUR' },
  { text: 'GBP', value: 'GBP' },
];

export const reportDateGroupingOptions = [
  { text: 'Günlük', value: "DAILY" as ReportDateGrouping },
  { text: 'Haftalık', value: "WEEKLY" as ReportDateGrouping },
  { text: 'Aylık', value: "MONTHLY" as ReportDateGrouping },
  { text: 'Yıllık', value: "YEARLY" as ReportDateGrouping },
  { text: 'general.all', value: "ALL" as ReportDateGrouping },
];

export const reportTypeOptionsAll =
  [
    { text: 'Satıcı', value: "SELLER" as ReportType },
    { text: 'Platform ciro', value: "PLATFORM" as ReportType },
    { text: 'Platform-Satıcı (Günlük)', value: "PLATFORM_SELLER" as ReportType },
    { text: 'Platform tüm akış', value: "PLATFORM_FLOW" as ReportType },
  ];

export const reportTypeOptionsSellerOnly =
  [
    { text: 'Satıcı', value: "SELLER" as ReportType },
  ];