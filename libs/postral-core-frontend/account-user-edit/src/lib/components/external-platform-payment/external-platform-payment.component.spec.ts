import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { AccountControllerService, ExternalPlatformControllerService, PaymentControllerService } from '@lotus/postral-core-frontend/client';
import { Observable, Subject, firstValueFrom, of, throwError } from 'rxjs';
import { ExternalPlatformPaymentComponent } from './external-platform-payment.component';

describe('ExternalPlatformPaymentComponent', () => {
  const accounts = { getAll: jest.fn() };
  const platforms = { findAllSearch: jest.fn() };
  const payments = { createExternalPlatformPayment: jest.fn() };
  const overlay = { confirm: jest.fn(), alert: jest.fn() };
  const router = { navigate: jest.fn() };
  const route = { pathFromRoot: [{ snapshot: { data: { paymentMode: 'seller' } } }] };
  let component: ExternalPlatformPaymentComponent;
  const getInstruction = () => {
    const instruction = component.instruction();
    if (!instruction) throw new Error('Expected an initialized form');
    return instruction;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    route.pathFromRoot[0].snapshot.data.paymentMode = 'seller';
    accounts.getAll.mockReturnValue(of([
      { id: 'seller', name: 'Seller', type: 'COMMERCIAL', defaultAddressId: 'address' },
      { id: 'external', name: 'External', isExternal: true, defaultAddressId: 'address' },
    ]));
    platforms.findAllSearch.mockReturnValue(of({ content: [
      { id: 'platform', name: 'Platform', active: true },
      { id: 'inactive', name: 'Inactive', active: false },
    ] }));
    overlay.confirm.mockReturnValue(of(true));
    payments.createExternalPlatformPayment.mockReturnValue(of({ id: 'payment' }));
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountControllerService, useValue: accounts },
        { provide: ExternalPlatformControllerService, useValue: platforms },
        { provide: PaymentControllerService, useValue: payments },
        { provide: BasicOverlayService, useValue: overlay },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
      ],
    });
    component = TestBed.runInInjectionContext(() => new ExternalPlatformPaymentComponent());
    component.ngOnInit();
  });

  it('loads only seller accounts and active platforms into form options', () => {
    expect(accounts.getAll).toHaveBeenCalledWith({ admin: 'false', type: 'COMMERCIAL', deactivated: 'NOT_DEACTIVATED' });
    const form = getInstruction().form;
    expect(form.value.sellerAccountId).toBe('seller');
    expect(form.getParameterMap().get('sellerOptions')).toEqual([{ text: 'Seller', value: 'seller' }]);
    expect(form.getParameterMap().get('platformOptions')).toEqual([{ text: 'Platform', value: 'platform' }]);
  });

  it('blocks customer mode without loading account or platform data', () => {
    jest.clearAllMocks();
    route.pathFromRoot[0].snapshot.data.paymentMode = 'customer';
    component = TestBed.runInInjectionContext(() => new ExternalPlatformPaymentComponent());
    component.ngOnInit();
    expect(component.instruction()).toBeNull();
    expect(component.loadError()).toContain('satıcılar');
    expect(accounts.getAll).not.toHaveBeenCalled();
  });

  it('confirms the exact gross total and prevents repeated confirmation while busy', async () => {
    const instruction = getInstruction();
    instruction.form.value.items[0].unitAmount = 120;
    instruction.form.value.items[0].quantity = 2;
    const pending = new Subject<boolean>();
    overlay.confirm.mockReturnValue(pending);
    const beforeSave = instruction.beforeSave;
    if (!beforeSave) throw new Error('Expected a save guard');
    const confirmation = beforeSave(instruction.form);
    if (!(confirmation instanceof Observable)) throw new Error('Expected observable confirmation');
    const result = firstValueFrom(confirmation);
    expect(overlay.confirm).toHaveBeenCalledWith('Harici satışı kaydet', expect.stringContaining('240.00 TRY'));
    expect(beforeSave(instruction.form)).toBe(false);
    pending.next(false);
    expect(await result).toBe(false);
    expect(component.busy()).toBe(false);
  });

  it('sends the selected seller on every item and trims the external order reference', async () => {
    const instruction = getInstruction();
    instruction.form.value.externalPlatformId = 'platform';
    instruction.form.value.externalPlatformOrderId = ' order ';
    const request = instruction.saveMethod(instruction.form.value);
    if (!(request instanceof Observable)) throw new Error('Expected observable request');
    await firstValueFrom(request);
    expect(payments.createExternalPlatformPayment).toHaveBeenCalledWith(expect.objectContaining({
      externalPlatformOrderId: 'order',
      items: [expect.objectContaining({ sellerAccountId: 'seller' })],
    }));
  });

  it('preserves form data and surfaces backend errors', () => {
    const instruction = getInstruction();
    instruction.form.value.externalPlatformOrderId = 'keep-this-order';
    instruction.afterSaveError(new HttpErrorResponse({
      status: 409, error: { message: 'Order already recorded' },
    }), instruction.form.value);
    expect(overlay.alert).toHaveBeenCalledWith('Kayıt hatası', 'Order already recorded', 'error', true);
    expect(instruction.form.value.externalPlatformOrderId).toBe('keep-this-order');
  });

  it('shows a load error instead of an empty successful form', () => {
    accounts.getAll.mockReturnValue(throwError(() => new Error('Unavailable')));
    component = TestBed.runInInjectionContext(() => new ExternalPlatformPaymentComponent());
    component.ngOnInit();
    expect(component.instruction()).toBeNull();
    expect(component.loadError()).not.toBe('');
    expect(overlay.alert).toHaveBeenCalledWith('Yükleme hatası', expect.any(String), 'error');
  });
});
