import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthManagementService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';
import { of } from 'rxjs';

import { LoginDialogComponent } from './login-dialog.component';

jest.mock('@lotus/front-global/auth', () => ({
  AuthManagementService: class {},
}));

jest.mock('@lotus/front-global/prompt-overlays', () => ({
  BasicOverlayService: class {},
}));

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  const authManager = { login: jest.fn() };
  const overlay = { alert: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    authManager.login.mockReturnValue(of({}));
    await TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      providers: [
        { provide: AuthManagementService, useValue: authManager },
        { provide: BasicOverlayService, useValue: overlay },
        {
          provide: LoadingIndicationService,
          useValue: { getObservable: () => of({ show: false }) },
        },
      ],
    })
      .overrideComponent(LoginDialogComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([true, false])(
    'passes the remember-me selection separately from credentials (%s)',
    (check) => {
      component.reform.patchValue({
        login: 'test-user',
        password: 'test-password',
        check,
      });
      const success = jest.spyOn(component.loginSuccess, 'emit');

      component.submit();

      expect(authManager.login).toHaveBeenCalledWith(
        { login: 'test-user', password: 'test-password' },
        check,
      );
      expect(success).toHaveBeenCalledWith(true);
    },
  );

  it('does not log in when required credentials are missing', () => {
    component.submit();

    expect(authManager.login).not.toHaveBeenCalled();
    expect(overlay.alert).toHaveBeenCalledWith(
      'mona.unable-to-login',
      'mona.required-fields',
      'error',
    );
  });
});
