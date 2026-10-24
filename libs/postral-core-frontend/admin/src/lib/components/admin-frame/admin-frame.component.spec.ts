import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthManagementService, RoleService } from '@lotus/front-global/auth';
import { UserDTO } from '@ubs-platform/users-common';
import { of, Subject } from 'rxjs';
import { AdminFrameComponent } from './admin-frame.component';

jest.mock('@lotus/front-global/auth', () => ({
  AuthManagementService: class {},
  RoleService: class {},
}));

jest.mock('@lotus/front-global/sidebar', () => ({
  SidebarItem: class {},
}));

@Component({ template: '' })
class LoginStubComponent {}

describe('AdminFrameComponent', () => {
  let fixture: ComponentFixture<AdminFrameComponent>;
  let userChanges: Subject<UserDTO | null>;
  let router: Router;
  let hasRole: jest.Mock;

  beforeEach(async () => {
    userChanges = new Subject<UserDTO | null>();
    hasRole = jest.fn(() => of(false));
    await TestBed.configureTestingModule({
      declarations: [AdminFrameComponent],
      providers: [
        provideRouter([
          { path: 'login', component: LoginStubComponent },
          { path: 'admin', component: LoginStubComponent },
          { path: 'admin/reports', component: LoginStubComponent },
        ]),
        {
          provide: AuthManagementService,
          useValue: { userChange: () => userChanges.asObservable() },
        },
        { provide: RoleService, useValue: { hasRole } },
      ],
    })
      .overrideComponent(AdminFrameComponent, { set: { template: '' } })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AdminFrameComponent);
    fixture.detectChanges();
  });

  it.each(['/admin', '/admin/reports'])(
    'redirects to login when the user logs out from %s',
    async (url) => {
      await router.navigateByUrl(url);
      const navigation = jest.spyOn(router, 'navigate');

      userChanges.next(null);
      await fixture.whenStable();

      expect(navigation).toHaveBeenCalledWith(['/login']);
      expect(router.url).toBe('/login');
      expect(hasRole).not.toHaveBeenCalled();
    },
  );

  it('does not redirect after the frame has been destroyed', async () => {
    await router.navigateByUrl('/admin');
    fixture.destroy();
    const navigation = jest.spyOn(router, 'navigate');

    userChanges.next(null);

    expect(navigation).not.toHaveBeenCalled();
  });

  it('logs navigation errors', async () => {
    const error = new Error('Navigation failed');
    jest.spyOn(router, 'navigate').mockRejectedValueOnce(error);
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});

    userChanges.next(null);
    await fixture.whenStable();

    expect(errorLog).toHaveBeenCalledWith(
      'Failed to navigate to login after logout',
      error,
    );
    errorLog.mockRestore();
  });
});
