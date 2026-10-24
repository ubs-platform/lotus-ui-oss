import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AccountDTO } from '@tk-postral/payment-common';
import { AccountControllerService, AddressControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { ReportSetupWizardService } from '@lotus/postral-core-frontend/reports';
import { AccountUserInfoComponent } from './account-user-info.component';

describe('AccountUserInfoComponent report setup', () => {
  let component: AccountUserInfoComponent;
  const account = () => Object.assign(new AccountDTO(), { id: 'seller', name: 'Seller', type: 'COMMERCIAL' as const });
  const accounts = { get: jest.fn(), create: jest.fn(), update: jest.fn() };
  const wizard = { open: jest.fn() };
  const router = { navigate: jest.fn() };
  const route = {
    params: new BehaviorSubject<Params>({ id: 'new' }),
    pathFromRoot: [{ snapshot: { data: { paymentMode: 'seller' } } }],
  };
  const instruction = () => {
    const value = component.instruction();
    if (!value) throw new Error('Expected account form');
    return value;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    route.params = new BehaviorSubject<Params>({ id: 'new' });
    route.pathFromRoot[0].snapshot.data.paymentMode = 'seller';
    accounts.get.mockReturnValue(of(account()));
    wizard.open.mockReturnValue(of(false));
    router.navigate.mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        AccountUserInfoComponent,
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
        { provide: AccountControllerService, useValue: accounts },
        { provide: AddressControllerService, useValue: {} },
        { provide: BasicOverlayService, useValue: { alert: jest.fn() } },
        { provide: PublisherTeamService, useValue: { getActiveTeamId: () => undefined } },
        { provide: ReportSetupWizardService, useValue: wizard },
      ],
    });
    component = TestBed.inject(AccountUserInfoComponent);
  });

  it.each(['new', 'create'])('opens setup after new commercial account creation via %s', async id => {
    route.params.next({ id });
    component.ngOnInit();
    expect(accounts.get).not.toHaveBeenCalled();
    await instruction().afterSaveSuccess(account(), account());
    expect(router.navigate).toHaveBeenCalled();
    expect(wizard.open).toHaveBeenCalledWith({ account: account() });
  });

  it('does not open automatically on existing account load or update, but offers manual setup', async () => {
    route.params.next({ id: 'seller' });
    component.ngOnInit();
    expect(component.canSetupReports()).toBe(true);
    await instruction().afterSaveSuccess(account(), account());
    expect(wizard.open).not.toHaveBeenCalled();
    component.setupReports();
    expect(wizard.open).toHaveBeenCalledWith({ account: account() });
  });

  it.each([
    { type: 'INDIVIDUAL' as const }, { isExternal: true }, { deactivated: true },
  ])('does not open setup for ineligible accounts %j', async overrides => {
    component.ngOnInit();
    const saved = Object.assign(account(), overrides);
    await instruction().afterSaveSuccess(saved, saved);
    expect(component.canSetupReports()).toBe(false);
    component.setupReports();
    expect(wizard.open).not.toHaveBeenCalled();
  });

  it('does not offer setup in customer mode', async () => {
    route.pathFromRoot[0].snapshot.data.paymentMode = 'customer';
    component.ngOnInit();
    await instruction().afterSaveSuccess(account(), account());
    component.setupReports();
    expect(wizard.open).not.toHaveBeenCalled();
  });

  it('opens with the saved account even while navigation reloads the account form', async () => {
    component.ngOnInit();
    router.navigate.mockImplementation(async () => {
      accounts.get.mockReturnValue(of(account()));
      route.params.next({ id: 'seller' });
      return true;
    });
    await instruction().afterSaveSuccess(account(), account());
    expect(wizard.open).toHaveBeenCalledWith({ account: account() });
  });
});
