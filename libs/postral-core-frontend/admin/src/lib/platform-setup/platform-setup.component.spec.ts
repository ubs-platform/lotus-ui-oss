import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { PlatformSetupClientService } from '@lotus/postral-core-frontend/client';
import { PlatformSetupStatusDTO } from '@tk-postral/payment-common';
import { PlatformSetupComponent } from './platform-setup.component';
import {
  PlatformSettingsForm,
  parseBillingDays,
  setupSettings,
} from './platform-setup.form';

describe('PlatformSetupComponent', () => {
  const client = {
    status: jest.fn(),
    team: jest.fn(),
    account: jest.fn(),
    settings: jest.fn(),
    complete: jest.fn(),
    keepExisting: jest.fn(),
  };
  const cscd = {
    getCountries: jest.fn(),
    hasSubdivisions: jest.fn(),
    getSubdivisions: jest.fn(),
    getLocalities: jest.fn(),
  };
  const overlay = { alert: jest.fn() };
  let component: PlatformSetupComponent;
  const status = (
    overrides: Partial<PlatformSetupStatusDTO> = {},
  ): PlatformSetupStatusDTO => ({
    status: 'IN_PROGRESS',
    step: 'TEAM',
    version: 1,
    legacyAvailable: false,
    ...overrides,
  });
  const instruction = <T, R>(value: FormEditInstruction<T, R> | null) => {
    if (!value) throw new Error('Expected setup form');
    return value;
  };
  const submit = async <T, R>(form: FormEditInstruction<T, R>) => {
    const output = form.saveMethod(form.form.value);
    const result = isObservable(output)
      ? await firstValueFrom(output)
      : await output;
    await form.afterSaveSuccess(result, form.form.value);
    return result;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    client.status.mockReturnValue(of(status()));
    client.team.mockReturnValue(
      of(status({ step: 'PLATFORM', teamName: 'Admin team', teamId: 'team' })),
    );
    client.account.mockReturnValue(
      of(status({ step: 'SETTINGS', platformAccountId: 'account' })),
    );
    client.settings.mockReturnValue(
      of(
        status({
          step: 'REVIEW',
          settings: setupSettings(new PlatformSettingsForm()),
        }),
      ),
    );
    client.complete.mockReturnValue(
      of(status({ status: 'COMPLETED', step: 'COMPLETED' })),
    );
    cscd.getCountries.mockReturnValue(of([{ code: 'TR', name: 'Turkey' }]));
    cscd.hasSubdivisions.mockReturnValue(of(true));
    cscd.getSubdivisions.mockReturnValue(
      of([{ code: '34', name: 'Istanbul' }]),
    );
    cscd.getLocalities.mockReturnValue(
      of([{ code: 'kadikoy', name: 'Kadikoy' }]),
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformSetupClientService, useValue: client },
        { provide: CscdClientService, useValue: cscd },
        { provide: BasicOverlayService, useValue: overlay },
      ],
    });
    component = TestBed.runInInjectionContext(
      () => new PlatformSetupComponent(),
    );
  });

  it('resumes from the backend step, preserves a pending team name and does not create anything on load', () => {
    client.status.mockReturnValue(of(status({ teamName: 'Pending team' })));
    component.ngOnInit();
    const form = instruction(component.teamForm()).form;
    expect(form.value.name).toBe('Pending team');
    const input = form
      .generateInputCarriers()
      .find((item) => item.carrierType === 'INPUT' && item.path === 'name');
    expect(input?.carrierType === 'INPUT' && input.disable).toBe(true);
    expect(client.team).not.toHaveBeenCalled();
  });

  it('starts with a team then reuses the address and account Reform forms', async () => {
    component.ngOnInit();
    instruction(component.teamForm()).form.patchValue({ name: 'Admin team' });
    await submit(instruction(component.teamForm()));
    expect(client.team).toHaveBeenCalledWith('Admin team');
    const address = instruction(component.addressForm());
    address.form.patchValue({
      name: 'Office',
      countryCodeUserInput: 'TR',
      subdivisionUserInput: '34',
      localityUserInput: 'kadikoy',
    });
    const preparation = address.beforeValidation?.(address.form);
    if (!isObservable(preparation))
      throw new Error('Expected address preparation observable');
    await firstValueFrom(preparation);
    await submit(address);
    expect(component.address()).toMatchObject({
      country: 'TR',
      cityName: 'Kadikoy',
      countrySubentity: 'Istanbul',
    });
    expect(client.account).not.toHaveBeenCalled();
    const account = instruction(component.accountForm());
    account.form.patchValue({ name: 'Company', legalIdentity: '1234567890' });
    const addressInput = account.form
      .generateInputCarriers()
      .find(
        (item) =>
          item.carrierType === 'INPUT' && item.path === 'defaultAddressId',
      );
    expect(addressInput?.carrierType === 'INPUT' && addressInput.disable).toBe(
      true,
    );
    await submit(account);
    expect(client.account).toHaveBeenCalledWith(
      expect.objectContaining({
        account: expect.objectContaining({
          name: 'Company',
          type: 'COMMERCIAL',
        }),
        address: expect.objectContaining({ country: 'TR' }),
      }),
      false,
    );
    expect(component.settingsForm()).not.toBeNull();
  });

  it('surfaces address lookup failures without advancing to account creation', async () => {
    client.status.mockReturnValue(
      of(status({ step: 'PLATFORM', teamId: 'team' })),
    );
    cscd.getCountries.mockReturnValue(
      throwError(() => new Error('countries unavailable')),
    );
    component.ngOnInit();
    const form = instruction(component.addressForm());
    const preparation = form.beforeValidation?.(form.form);
    if (!isObservable(preparation))
      throw new Error('Expected address preparation observable');
    await expect(firstValueFrom(preparation)).rejects.toThrow('no elements');
    expect(component.error()).toBe('postral.platform-setup.save-error');
    expect(component.preparing()).toBe(false);
    expect(component.accountForm()).toBeNull();
  });

  it('repairs a saved account without reopening forms or asking for private data again', () => {
    client.status.mockReturnValue(
      of(status({ step: 'PLATFORM', platformAccountId: 'saved' })),
    );
    component.ngOnInit();
    expect(component.accountAlreadySaved()).toBe(true);
    expect(component.addressForm()).toBeNull();
    component.repairOwnership();
    expect(client.account).toHaveBeenCalledWith({ account: {} }, false);
    expect(component.state()?.step).toBe('SETTINGS');
  });

  it('uses a distinct seller endpoint while allowing reuse of the platform address', async () => {
    client.status.mockReturnValue(
      of(status({ step: 'SELLER', platformAccountId: 'platform' })),
    );
    component.ngOnInit();
    component.usePlatformAddress();
    await submit(instruction(component.accountForm()));
    expect(client.account).toHaveBeenCalledWith(
      expect.objectContaining({ usePlatformAddress: true, address: undefined }),
      true,
    );
  });

  it('never defaults to completed when status fails and supports retry', () => {
    client.status.mockReturnValueOnce(throwError(() => new Error('offline')));
    component.ngOnInit();
    expect(component.state()).toBeNull();
    expect(component.error()).toBe('postral.platform-setup.load-error');
    expect(component.loading()).toBe(false);
    component.load();
    expect(component.state()?.step).toBe('TEAM');
    expect(component.error()).toBe('');
  });

  it('shows a welcome screen before a fresh setup and enters the team step on start', () => {
    client.status.mockReturnValue(of(status({ status: 'NOT_STARTED' })));
    component.ngOnInit();
    expect(component.screen()).toBe('WELCOME');
    component.start();
    expect(component.screen()).toBe('TEAM');
    expect(component.teamForm()).not.toBeNull();
  });

  it('skips the welcome screen when resuming an in-progress setup', () => {
    client.status.mockReturnValue(
      of(status({ step: 'PLATFORM', teamId: 'team' })),
    );
    component.ngOnInit();
    expect(component.screen()).toBe('ADDRESS');
  });

  it('keeps an existing installation on the welcome screen for adoption', () => {
    client.status.mockReturnValue(
      of(status({ status: 'NOT_STARTED', legacyAvailable: true })),
    );
    component.ngOnInit();
    expect(component.screen()).toBe('WELCOME');
  });

  it('offers adoption rather than new resource creation for an existing installation', () => {
    client.status.mockReturnValue(
      of(status({ status: 'NOT_STARTED', legacyAvailable: true })),
    );
    component.ngOnInit();
    expect(component.teamForm()).toBeNull();
    expect(client.team).not.toHaveBeenCalled();
  });

  it('shows backend errors and only completes after the server confirms completion', () => {
    component.ngOnInit();
    client.complete.mockReturnValueOnce(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            error: { message: 'Existing commission conflicts' },
          }),
      ),
    );
    component.finish();
    expect(component.serverError()).toBe('Existing commission conflicts');
    expect(component.state()?.status).toBe('IN_PROGRESS');
    expect(component.saving()).toBe(false);
    component.finish();
    expect(component.state()?.status).toBe('COMPLETED');
  });

  it.each([false, true])(
    'submits the optional dummy channel selection at the final step: %s',
    (selected) => {
      client.status.mockReturnValue(
        of(
          status({
            step: 'REVIEW',
            settings: setupSettings(new PlatformSettingsForm()),
          }),
        ),
      );
      component.ngOnInit();
      const form = instruction(component.channelsForm());
      expect(form.form.value.dummyEcommerce).toBe(false);
      form.form.patchValue({ dummyEcommerce: selected });
      component.finish();
      expect(client.complete).toHaveBeenCalledWith({
        paymentChannelIds: selected ? ['dummy-ecommerce'] : [],
      });
    },
  );

  it('preserves the channel checkbox when completion fails so it can be retried', () => {
    client.status.mockReturnValue(
      of(
        status({
          step: 'REVIEW',
          settings: setupSettings(new PlatformSettingsForm()),
        }),
      ),
    );
    client.complete.mockReturnValueOnce(throwError(() => new Error('offline')));
    component.ngOnInit();
    instruction(component.channelsForm()).form.patchValue({
      dummyEcommerce: true,
    });
    component.finish();
    expect(
      instruction(component.channelsForm()).form.value.dummyEcommerce,
    ).toBe(true);
    expect(component.error()).toBe('postral.platform-setup.save-error');
    component.finish();
    expect(client.complete).toHaveBeenLastCalledWith({
      paymentChannelIds: ['dummy-ecommerce'],
    });
  });
});

describe('Platform setup settings', () => {
  it('adds and removes tax rows through the rendered Reform carrier actions', () => {
    const form = new Reform(PlatformSettingsForm, new PlatformSettingsForm());
    const taxGroup = () => {
      const group = form
        .generateInputCarriers()
        .find(
          (carrier) =>
            carrier.carrierType === 'GROUP' &&
            carrier.propertyMeta.name === 'additionalTaxes',
        );
      if (!group || group.carrierType !== 'GROUP')
        throw new Error('Expected tax array group');
      return group;
    };
    const add = taxGroup().items.find(
      (carrier) =>
        carrier.carrierType === 'ACTION' && carrier.title === 'insert',
    );
    if (!add || add.carrierType !== 'ACTION')
      throw new Error('Expected tax insert action');
    add.action?.();
    expect(form.value.additionalTaxes).toHaveLength(5);
    const name = taxGroup().items.find(
      (carrier) =>
        carrier.carrierType === 'INPUT' &&
        carrier.path === 'additionalTaxes.4.taxName',
    );
    if (!name || name.carrierType !== 'INPUT')
      throw new Error('Expected added tax name input');
    name.setValue('Custom VAT');
    expect(form.value.additionalTaxes[4]).toMatchObject({
      taxName: 'Custom VAT',
      taxRate: 0,
    });
    const remove = taxGroup().items.find(
      (carrier) =>
        carrier.carrierType === 'ACTION' && carrier.title === 'remove',
    );
    if (!remove || remove.carrierType !== 'ACTION')
      throw new Error('Expected tax remove action');
    remove.action?.();
    expect(form.value.additionalTaxes).toHaveLength(4);
    expect(setupSettings(form.value).additionalTaxes?.at(-1)).toEqual({
      taxName: 'Custom VAT',
      taxRate: 0,
    });
  });

  it('offers editable tax presets and submits only the remaining rows', () => {
    const data = new PlatformSettingsForm();
    expect(data.additionalTaxes.map((tax) => tax.taxRate)).toEqual([
      0, 1, 10, 20,
    ]);
    data.additionalTaxes.splice(1, 2);
    data.additionalTaxes.push({ taxName: ' Custom VAT ', taxRate: 5 });
    expect(setupSettings(data).additionalTaxes).toEqual([
      { taxName: 'KDV %0', taxRate: 0 },
      { taxName: 'KDV %20', taxRate: 20 },
      { taxName: 'Custom VAT', taxRate: 5 },
    ]);
    data.additionalTaxes = [];
    expect(setupSettings(data).additionalTaxes).toEqual([]);
  });

  it('does not share editable tax rows between forms', () => {
    const first = new PlatformSettingsForm();
    first.additionalTaxes[0].taxRate = 99;
    expect(new PlatformSettingsForm().additionalTaxes[0].taxRate).toBe(0);
  });

  it('validates tax row names and inclusive integer percentage boundaries', () => {
    const data = new PlatformSettingsForm();
    const form = new Reform(PlatformSettingsForm, data);
    data.additionalTaxes = [{ taxName: '', taxRate: 20 }];
    expect(form.hasErrors()).toBe(true);
    data.additionalTaxes = [{ taxName: 'VAT', taxRate: 20.5 }];
    expect(form.hasErrors()).toBe(true);
    data.additionalTaxes = [
      { taxName: 'VAT', taxRate: 100 },
      { taxName: 'Exempt', taxRate: 0 },
    ];
    expect(form.hasErrors()).toBe(false);
  });

  it('defaults to TRY, 20% commission-service tax, days 1/28, and all three report periods', () => {
    const form = new PlatformSettingsForm();
    expect(form).toMatchObject({
      currency: 'TRY',
      taxRate: 20,
      billingDaysText: '1, 28',
      daily: true,
      monthly: true,
      yearly: true,
    });
  });

  it('requires daily regardless of tampering and disables marketplace settings for own-sales', () => {
    const form = Object.assign(new PlatformSettingsForm(), {
      daily: false,
      monthly: false,
      alsoSells: true,
      commissionPercent: 15,
    });
    expect(setupSettings(form)).toEqual({
      mode: 'SELF',
      currency: 'TRY',
      commissionPercent: 0,
      taxRate: 0,
      billingDays: [],
      alsoSells: false,
      sellerReports: true,
      dateGroupings: ['DAILY', 'YEARLY'],
      additionalTaxes: new PlatformSettingsForm().additionalTaxes,
    });
  });

  it.each(['0', '29', '1.5', '1,', '1e1', '', '1, 29', '1 28'])(
    'rejects invalid billing days %s',
    (value) => {
      expect(parseBillingDays(value)).toEqual([]);
    },
  );

  it('accepts exact inclusive boundaries and normalizes duplicate days', () => {
    expect(parseBillingDays('28, 1, 1')).toEqual([1, 28]);
  });

  it.each([0, 100])(
    'accepts boundary percentages including zero: %d',
    (value) => {
      const form = new Reform(
        PlatformSettingsForm,
        Object.assign(new PlatformSettingsForm(), {
          mode: 'MARKETPLACE',
          commissionPercent: value,
          taxRate: value,
        }),
      );
      expect(form.hasErrors()).toBe(false);
    },
  );
});
