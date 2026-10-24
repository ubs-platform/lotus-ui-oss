import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@lotus/front-global/auth/service';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PlatformSetupClientService } from '@lotus/postral-core-frontend/client/platform-setup';
import {
  platformSetupEntryGuard,
  platformSetupAdminGuard,
} from './platform-setup.guard';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';

describe('Platform setup routing', () => {
  const auth = { hasRole: jest.fn() };
  const client = { status: jest.fn() };
  const router = { parseUrl: jest.fn((url: string) => url) };
  const overlay = { alert: jest.fn() };
  const run = async (guard: CanActivateFn, url = '/admin') => {
    const result = TestBed.runInInjectionContext(() =>
      guard(new ActivatedRouteSnapshot(), { url } as RouterStateSnapshot),
    );
    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    auth.hasRole.mockReturnValue(of(true));
    client.status.mockReturnValue(of({ status: 'NOT_STARTED' }));
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: PlatformSetupClientService, useValue: client },
        { provide: Router, useValue: router },
        { provide: BasicOverlayService, useValue: overlay },
      ],
    });
  });

  it('redirects administrators with unfinished setup, including seller-account deep links', async () => {
    expect(
      await run(platformSetupEntryGuard, '/user/payment-accounts/account'),
    ).toBe('/admin/setup');
    expect(auth.hasRole).toHaveBeenCalledWith(
      'ADMIN',
      'POSTRAL-ADMIN',
      'POSTRAL_ADMIN',
    );
  });

  it('never calls the admin endpoint for a regular seller or blocks their homepage', async () => {
    auth.hasRole.mockReturnValue(of(false));
    expect(await run(platformSetupEntryGuard)).toBe(true);
    expect(client.status).not.toHaveBeenCalled();
  });

  it('allows completed installations and avoids redirect loops on the setup route', async () => {
    client.status.mockReturnValue(of({ status: 'COMPLETED' }));
    expect(await run(platformSetupEntryGuard)).toBe(true);
    expect(await run(platformSetupEntryGuard, '/admin/setup?resume=1')).toBe(
      true,
    );
  });

  it('shows a retry error rather than assuming setup is complete when status fails', async () => {
    client.status.mockReturnValue(throwError(() => new Error('offline')));
    expect(await run(platformSetupEntryGuard)).toBe('/admin/setup');
    expect(overlay.alert).toHaveBeenCalled();
  });

  it('denies sellers and failed role checks at the setup page', async () => {
    auth.hasRole.mockReturnValue(of(false));
    expect(await run(platformSetupAdminGuard)).toBe('/admin');
    auth.hasRole.mockReturnValue(throwError(() => new Error('offline')));
    expect(await run(platformSetupAdminGuard)).toBe(false);
    expect(overlay.alert).toHaveBeenCalled();
  });
});
