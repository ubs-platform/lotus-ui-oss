import { TestBed } from '@angular/core/testing';
import { Subject, firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { AccountControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { WEBDIALOG_CONFIG, WebdialogReference } from '@lotus/front-global/webdialog';
import { SellerReportSetupResultDTO } from '@tk-postral/payment-common';
import { ReportSetupComponent, ReportSetupDialogData } from './report-setup.component';
import { ReportSetupForm } from './report-setup.form';

describe('ReportSetupComponent', () => {
  const accounts = { getAll: jest.fn(), previewReportSetup: jest.fn(), setupReports: jest.fn() };
  const dialog = { close: jest.fn() };
  const overlay = { alert: jest.fn() };
  let component: ReportSetupComponent;
  let data: ReportSetupDialogData;
  const result = (currency = 'TRY'): SellerReportSetupResultDTO => ({
    accountId: 'seller', currency, existing: [], created: [], missing: ['DAILY', 'MONTHLY', 'YEARLY'],
  });
  const instruction = () => {
    const value = component.instruction();
    if (!value) throw new Error('Expected setup form');
    return value;
  };
  const save = (value = instruction().form.value) => {
    const output = instruction().saveMethod(value);
    if (!isObservable(output)) throw new Error('Expected setup observable');
    return firstValueFrom(output);
  };
  const initialize = () => {
    component = TestBed.runInInjectionContext(() => new ReportSetupComponent());
    component.ngOnInit();
  };

  beforeEach(() => {
    jest.resetAllMocks();
    data = {};
    accounts.getAll.mockReturnValue(of([
      { id: 'seller', name: 'Seller', type: 'COMMERCIAL' },
      { id: 'external', isExternal: true }, { id: 'inactive', deactivated: true },
    ]));
    accounts.previewReportSetup.mockReturnValue(of(result()));
    accounts.setupReports.mockReturnValue(of(result()));
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountControllerService, useValue: accounts },
        { provide: BasicOverlayService, useValue: overlay },
        { provide: WebdialogReference, useValue: dialog },
        { provide: WEBDIALOG_CONFIG, useFactory: () => ({ data, defaultOutValue: false }) },
      ],
    });
  });

  it('defaults to TRY, daily/monthly/yearly selected and disables daily', () => {
    initialize();
    expect(instruction().form.value).toEqual(expect.objectContaining({
      accountId: 'seller', currency: 'TRY', daily: true, monthly: true, yearly: true,
    }));
    const daily = instruction().form.generateInputCarriers().find(carrier => carrier.carrierType === 'INPUT' && carrier.path === 'daily');
    expect(daily?.carrierType === 'INPUT' && daily.disable).toBe(true);
    expect(accounts.previewReportSetup).toHaveBeenCalledWith('seller', 'TRY');
  });

  it('fixes the requested account and preserves the selected report currency', () => {
    data = { accountId: 'seller', currency: 'USD' };
    initialize();
    const account = instruction().form.generateInputCarriers().find(carrier => carrier.carrierType === 'INPUT' && carrier.path === 'accountId');
    expect(account?.carrierType === 'INPUT' && account.disable).toBe(true);
    expect(accounts.previewReportSetup).toHaveBeenCalledWith('seller', 'USD');
  });

  it('waits for account selection if several accounts are available', () => {
    accounts.getAll.mockReturnValue(of([{ id: 'seller', name: 'A' }, { id: 'other', name: 'B' }]));
    initialize();
    expect(accounts.previewReportSetup).not.toHaveBeenCalled();
    expect(component.preview()).toBeNull();
    instruction().form.patchValue({ accountId: 'seller' });
    expect(accounts.previewReportSetup).toHaveBeenCalledWith('seller', 'TRY');
  });

  it('submits the chosen periods but always includes daily even if its value is tampered with', async () => {
    initialize();
    const value = { ...instruction().form.value, daily: false, monthly: false };
    await save(value);
    expect(accounts.setupReports).toHaveBeenCalledWith('seller', {
      currency: 'TRY', dateGroupings: ['DAILY', 'YEARLY'],
    });
  });

  it('submits all three periods by default and only daily if optional periods are unchecked', async () => {
    initialize();
    await save();
    expect(accounts.setupReports).toHaveBeenLastCalledWith('seller', {
      currency: 'TRY', dateGroupings: ['DAILY', 'MONTHLY', 'YEARLY'],
    });
    await save({ ...instruction().form.value, monthly: false, yearly: false });
    expect(accounts.setupReports).toHaveBeenLastCalledWith('seller', { currency: 'TRY', dateGroupings: ['DAILY'] });
  });

  it('cancels stale previews when currency changes and blocks save while the new preview is pending', async () => {
    const oldPreview = new Subject<SellerReportSetupResultDTO>();
    const newPreview = new Subject<SellerReportSetupResultDTO>();
    accounts.previewReportSetup.mockReturnValueOnce(oldPreview).mockReturnValueOnce(newPreview);
    initialize();
    instruction().form.patchValue({ currency: 'USD' });
    oldPreview.next(result());
    expect(component.preview()).toBeNull();
    await expect(save()).rejects.toThrow('preview is not ready');
    expect(accounts.setupReports).not.toHaveBeenCalled();
    newPreview.next(result('USD'));
    expect(component.preview()?.currency).toBe('USD');
  });

  it('surfaces preview errors, blocks saving and supports retry', async () => {
    accounts.previewReportSetup.mockReturnValueOnce(throwError(() => new Error('offline')));
    initialize();
    expect(component.error()).toBe('postral.report-setup.preview-error');
    await expect(save()).rejects.toThrow();
    component.retry();
    expect(component.preview()).toEqual(result());
    expect(component.error()).toBe('');
  });

  it('preserves the form after a save error and allows retry', async () => {
    accounts.setupReports.mockReturnValueOnce(throwError(() => new Error('database unavailable')));
    initialize();
    await expect(save()).rejects.toThrow('database unavailable');
    instruction().afterSaveError(new Error('failed'), instruction().form.value);
    expect(component.error()).toBe('postral.report-setup.save-error');
    expect(dialog.close).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
    component.retry();
    await save();
  });

  it('blocks duplicate saves and cancellation during an in-flight save', async () => {
    const pending = new Subject<SellerReportSetupResultDTO>();
    accounts.setupReports.mockReturnValue(pending);
    initialize();
    const first = save();
    expect(component.saving()).toBe(true);
    expect(instruction().form.generateInputCarriers().every(carrier => carrier.carrierType !== 'INPUT' || carrier.disable)).toBe(true);
    component.cancel();
    expect(dialog.close).not.toHaveBeenCalled();
    await expect(save()).rejects.toThrow();
    expect(accounts.setupReports).toHaveBeenCalledTimes(1);
    pending.next(result());
    pending.complete();
    await first;
    expect(component.saving()).toBe(false);
  });

  it('closes only after successful setup and reports created/existing counts', () => {
    initialize();
    instruction().afterSaveSuccess(result(), new ReportSetupForm());
    expect(dialog.close).toHaveBeenCalledWith(true);
    expect(overlay.alert).toHaveBeenCalledWith('postral.report-setup.complete',
      { key: 'postral.report-setup.result', parameters: { created: 0, existing: 0 } }, 'success');
  });

  it('does not silently substitute another account when the requested account is unavailable', () => {
    data = { accountId: 'missing' };
    initialize();
    expect(component.error()).toBe('postral.report-setup.no-accounts');
    expect(accounts.previewReportSetup).not.toHaveBeenCalled();
  });

  it('retries account loading errors and later cancels without creating queries', () => {
    accounts.getAll.mockReturnValueOnce(throwError(() => new Error('offline')));
    initialize();
    expect(component.error()).toBe('postral.report-setup.accounts-error');
    component.retry();
    expect(component.instruction()).not.toBeNull();
    component.cancel();
    expect(dialog.close).toHaveBeenCalledWith(false);
    expect(accounts.setupReports).not.toHaveBeenCalled();
  });
});
