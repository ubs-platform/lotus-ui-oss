import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { currencyOptions } from '@lotus/postral-core-frontend/forms';

@minkyRoot()
export class ReportSetupForm {
  @minky({
    label: 'postral.report-setup.account', inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: env => env.parameters.get('accounts'),
  })
  accountId = '';

  @minky({
    label: 'postral.report-setup.currency', inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => currencyOptions,
  })
  currency = 'TRY';

  @minky({ label: 'postral.report-setup.daily-required', inputType: 'checkbox', disable: true })
  daily = true;

  @minky({ label: 'postral.report-setup.monthly', inputType: 'checkbox' })
  monthly = true;

  @minky({ label: 'postral.report-setup.yearly', inputType: 'checkbox' })
  yearly = true;
}
