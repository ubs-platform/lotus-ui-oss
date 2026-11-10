import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserDTO } from '@ubs-platform/users-common';
import { of, throwError } from 'rxjs';
import { TOKEN_FIELD, TokenGetter } from '../common/token-getter';
import { AuthManagementService } from './auth-management.service';
import { AuthService } from './auth.service';

jest.mock('@lotus/front-global/mona-mobile-experience-ng', () => ({
  onlineStatus: of(true),
}));

describe('AuthManagementService token persistence', () => {
  let service: AuthManagementService;
  const user = new UserDTO();
  const credentials = { login: 'test-user', password: 'test-password' };
  const authService = {
    authenticate: jest.fn(),
    findCurrentUser: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.resetAllMocks();
    authService.authenticate.mockReturnValue(of({ token: 'new-token' }));
    authService.findCurrentUser.mockReturnValue(of(user));
    authService.logout.mockReturnValue(of(null));
    TestBed.configureTestingModule({
      providers: [
        AuthManagementService,
        TokenGetter,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });
    service = TestBed.inject(AuthManagementService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it.each([true, false])(
    'saves login tokens in the selected storage (rememberMe=%s)',
    (rememberMe) => {
      localStorage.setItem(TOKEN_FIELD, 'old-local-token');
      sessionStorage.setItem(TOKEN_FIELD, 'old-session-token');
      const selected = rememberMe ? localStorage : sessionStorage;
      const other = rememberMe ? sessionStorage : localStorage;
      const next = jest.fn();

      service.login(credentials, rememberMe).subscribe(next);

      expect(authService.authenticate).toHaveBeenCalledWith(credentials);
      expect(selected.getItem(TOKEN_FIELD)).toBe('new-token');
      expect(other.getItem(TOKEN_FIELD)).toBeNull();
      expect(service.getToken()).toBe('new-token');
      expect(next).toHaveBeenCalledWith(user);
    },
  );

  it('keeps direct logins persistent by default', () => {
    service.login(credentials).subscribe();

    expect(localStorage.getItem(TOKEN_FIELD)).toBe('new-token');
    expect(sessionStorage.getItem(TOKEN_FIELD)).toBeNull();
  });

  it('clears both storages on logout without clearing unrelated data', () => {
    localStorage.setItem(TOKEN_FIELD, 'local-token');
    sessionStorage.setItem(TOKEN_FIELD, 'session-token');
    localStorage.setItem('theme', 'dark');
    sessionStorage.setItem('suspendReason', 'reason');
    const next = jest.fn();

    service.logout().subscribe(next);

    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem(TOKEN_FIELD)).toBeNull();
    expect(sessionStorage.getItem(TOKEN_FIELD)).toBeNull();
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(sessionStorage.getItem('suspendReason')).toBe('reason');
    expect(next).toHaveBeenCalledWith(true);
  });

  it('clears both storages when the session is rejected', () => {
    const error = new Error('Session expired');
    const log = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    authService.findCurrentUser.mockReturnValue(throwError(() => error));
    localStorage.setItem(TOKEN_FIELD, 'local-token');
    sessionStorage.setItem(TOKEN_FIELD, 'session-token');
    const onError = jest.fn();

    try {
      service.checkUser().subscribe({ error: onError });

      expect(localStorage.getItem(TOKEN_FIELD)).toBeNull();
      expect(sessionStorage.getItem(TOKEN_FIELD)).toBeNull();
      expect(onError).toHaveBeenCalledWith(error);
      expect(log).toHaveBeenCalledWith(error);
    } finally {
      log.mockRestore();
    }
  });

  it('does not replace the current token after failed authentication', () => {
    const error = new Error('Invalid credentials');
    authService.authenticate.mockReturnValue(throwError(() => error));
    localStorage.setItem(TOKEN_FIELD, 'existing-token');
    const onError = jest.fn();

    service.login(credentials, false).subscribe({ error: onError });

    expect(localStorage.getItem(TOKEN_FIELD)).toBe('existing-token');
    expect(sessionStorage.getItem(TOKEN_FIELD)).toBeNull();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
