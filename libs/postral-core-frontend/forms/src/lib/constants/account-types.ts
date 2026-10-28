import { ReportDateGrouping, ReportType } from "@tk-postral/payment-common";

export const accountTypes = [
  { text: 'Kişisel', value: 'INDIVIDUAL' },
  { text: 'Ticari', value: 'COMMERCIAL' },
];

export const accountTypeIndividual = [
  { text: 'Kişisel', value: 'INDIVIDUAL' },
];
const currencyi18nPrefix = "postral.currencies."
export const currencyOptions = [
  { text: currencyi18nPrefix + 'TRY', value: 'TRY' },
  { text: currencyi18nPrefix + 'USD', value: 'USD' },
  { text: currencyi18nPrefix + 'EUR', value: 'EUR' },
  { text: currencyi18nPrefix + 'GBP', value: 'GBP' },
  { text: currencyi18nPrefix + 'JPY', value: 'JPY' },
  { text: currencyi18nPrefix + 'CNY', value: 'CNY' },
  { text: currencyi18nPrefix + 'KRW', value: 'KRW' },
  { text: currencyi18nPrefix + 'AUD', value: 'AUD' },
  { text: currencyi18nPrefix + 'CAD', value: 'CAD' },
  { text: currencyi18nPrefix + 'CHF', value: 'CHF' },
  { text: currencyi18nPrefix + 'SEK', value: 'SEK' },
  { text: currencyi18nPrefix + 'NOK', value: 'NOK' },
  { text: currencyi18nPrefix + 'DKK', value: 'DKK' },
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