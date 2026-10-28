import {
  minky,
  minkyRoot,
  RequiredValidator,
  Validator,
  ValidatorResult,
} from '@lotus/front-global/minky/core';
import { currencyOptions } from '@lotus/postral-core-frontend/forms/account-types';
import {
  PlatformSetupMode,
  PlatformSetupSettingsDTO,
  PlatformSetupTaxDTO,
  SellerReportSetupGrouping,
} from '@tk-postral/payment-common';

export function parseBillingDays(value: string): number[] {
  if (!/^\s*\d{1,2}(\s*,\s*\d{1,2})*\s*$/.test(value)) return [];
  const days = value.split(',').map((day) => Number(day.trim()));
  return days.every((day) => day >= 1 && day <= 28)
    ? [...new Set(days)].sort((a, b) => a - b)
    : [];
}

class BillingDaysValidator implements Validator {
  labelKey = 'postral.platform-setup.billing-days-help';
  validate(value: unknown) {
    return new ValidatorResult(
      this.labelKey,
      typeof value === 'string' && parseBillingDays(value).length > 0,
    );
  }
}

class IntegerPercentValidator implements Validator {
  labelKey = 'postral.platform-setup.tax-rate-help';
  validate(value: unknown) {
    return new ValidatorResult(
      this.labelKey,
      typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 100,
    );
  }
}

class CommissionPercentValidator implements Validator {
  labelKey = 'postral.platform-setup.commission-help';
  validate(value: unknown) {
    return new ValidatorResult(
      this.labelKey,
      typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100,
    );
  }
}

@minkyRoot()
export class PlatformChannelsForm {
  @minky({
    label: 'postral.platform-setup.dummy-channel',
    inputType: 'checkbox',
  })
  dummyEcommerce = false;
}

@minkyRoot()
export class PlatformTeamForm {
  @minky({
    label: 'postral.platform-setup.team-name',
    validators: [new RequiredValidator()],
  })
  name = '';
}

@minkyRoot()
export class PlatformTaxForm implements PlatformSetupTaxDTO {
  @minky({
    label: 'postral.platform-setup.tax-name',
    validators: [new RequiredValidator()],
    widthRatio: "50%",
  })
  taxName = '';

  @minky({
    label: 'postral.platform-setup.tax-rate',
    inputType: 'number',
    validators: [new IntegerPercentValidator()],
    widthRatio: "50%",
  })
  taxRate = 0;
}

@minkyRoot()
export class PlatformSettingsForm {
  @minky({
    label: 'postral.platform-setup.mode',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => [
      { value: 'SELF', text: 'postral.platform-setup.self' },
      { value: 'MARKETPLACE', text: 'postral.platform-setup.marketplace' },
    ],
    emitInitialValueChange: true,
    onValueChange: (value, _old, env) => {
      for (const path of [
        'commissionPercent',
        'taxRate',
        'billingDaysText',
        'alsoSells',
      ]) {
        env.state.setHidden?.(path, value !== 'MARKETPLACE');
      }
      env.state.setHidden?.(
        'sellerReports',
        value === 'MARKETPLACE' && !env.state.formValue.alsoSells,
      );
    },
  })
  mode: PlatformSetupMode = 'SELF';

  @minky({
    label: 'postral.report-setup.currency',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => currencyOptions,
  })
  currency = 'TRY';

  @minky({
    label: 'postral.platform-setup.commission',
    inputType: 'number',
    validators: [new CommissionPercentValidator()],
  })
  commissionPercent = 0;

  @minky({
    label: 'postral.platform-setup.tax',
    description: 'postral.platform-setup.tax-help',
    inputType: 'number',
    validators: [new IntegerPercentValidator()],
  })
  taxRate = 20;

  @minky({
    label: 'postral.platform-setup.additional-taxes',
    description: 'postral.platform-setup.additional-taxes-help',
    inputType: 'array',
    arrayItemInputType: 'sub-object',
    subObjectKey: PlatformTaxForm,
    allowUserAddAndRemoveItem: true,
  })
  additionalTaxes: PlatformTaxForm[] = [0, 1, 10, 20].map((taxRate) =>
    Object.assign(new PlatformTaxForm(), {
      taxName: `KDV %${taxRate}`,
      taxRate,
    }),
  );

  @minky({
    label: 'postral.platform-setup.billing-days',
    description: 'postral.platform-setup.billing-days-help',
    validators: [new BillingDaysValidator()],
  })
  billingDaysText = '1, 28';

  @minky({
    label: 'postral.platform-setup.also-sells',
    inputType: 'checkbox',
    onValueChange: (value, _old, env) => {
      env.state.setHidden?.(
        'sellerReports',
        env.state.formValue.mode === 'MARKETPLACE' && !value,
      );
    },
  })
  alsoSells = false;

  @minky({
    label: 'postral.platform-setup.seller-reports',
    inputType: 'checkbox',
  })
  sellerReports = true;

  @minky({
    label: 'postral.report-setup.daily-required',
    inputType: 'checkbox',
    disable: true,
  })
  daily = true;

  @minky({ label: 'postral.report-setup.monthly', inputType: 'checkbox' })
  monthly = true;

  @minky({ label: 'postral.report-setup.yearly', inputType: 'checkbox' })
  yearly = true;
}

export function setupSettings(
  data: PlatformSettingsForm,
): PlatformSetupSettingsDTO {
  const dateGroupings: SellerReportSetupGrouping[] = ['DAILY'];
  if (data.monthly) dateGroupings.push('MONTHLY');
  if (data.yearly) dateGroupings.push('YEARLY');
  return {
    mode: data.mode,
    currency: data.currency,
    commissionPercent: data.mode === 'SELF' ? 0 : data.commissionPercent,
    taxRate: data.mode === 'SELF' ? 0 : data.taxRate,
    billingDays:
      data.mode === 'SELF' ? [] : parseBillingDays(data.billingDaysText),
    alsoSells: data.mode === 'MARKETPLACE' && data.alsoSells,
    sellerReports:
      data.sellerReports && (data.mode === 'SELF' || data.alsoSells),
    dateGroupings,
    additionalTaxes: data.additionalTaxes.map((tax) => ({
      taxName: tax.taxName.trim(),
      taxRate: tax.taxRate,
    })),
  };
}
