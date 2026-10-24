import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthManagementService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { DebugKeyValueViewComponentService } from '@lotus/front-global/debug-tools';
import { FeedbackDialogService } from '@lotus/front-global/feedback-dialog';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { of } from 'rxjs';
import { GenericAppHeaderComponent } from './generic-app-header.component';

jest.mock('@lotus/front-global/auth', () => ({
  AuthManagementService: class {},
}));
jest.mock('@lotus/front-global/prompt-overlays', () => ({
  BasicOverlayService: class {},
}));
jest.mock('@lotus/front-global/debug-tools', () => ({
  DebugKeyValueViewComponentService: class {},
}));
jest.mock('@lotus/front-global/feedback-dialog', () => ({
  FeedbackDialogService: class {},
}));
jest.mock('@lotus/front-global/user-service-wraps', () => ({
  LoadingIndicationService: class {},
}));
jest.mock('@lotus/front-global/theme-management', () => ({
  ThemeManager: class {},
}));

describe('GenericAppHeaderComponent', () => {
  let component: GenericAppHeaderComponent;
  let fixture: ComponentFixture<GenericAppHeaderComponent>;
  let navigateByUrl: jest.Mock;
  let logout: jest.Mock;
  let confirm: jest.Mock;
  let router: { url: string; navigateByUrl: jest.Mock };

  beforeEach(async () => {
    navigateByUrl = jest.fn().mockResolvedValue(true);
    logout = jest.fn(() => of(true));
    confirm = jest.fn(() => of(true));
    router = { url: '/admin', navigateByUrl };
    await TestBed.configureTestingModule({
      declarations: [GenericAppHeaderComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthManagementService, useValue: { logout } },
        { provide: BasicOverlayService, useValue: { confirm } },
        { provide: DebugKeyValueViewComponentService, useValue: {} },
        { provide: FeedbackDialogService, useValue: {} },
        { provide: LoadingIndicationService, useValue: {} },
        { provide: ThemeManager, useValue: {} },
      ],
    })
      .overrideComponent(GenericAppHeaderComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(GenericAppHeaderComponent);
    component = fixture.componentInstance;
    jest.spyOn(component, 'hideMenuRaw').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the homepage as the default logout destination', () => {
    component.logout();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it.each(['/admin', '/admin/reports', '/'])(
    'uses the application logout destination from %s',
    (url) => {
      router.url = url;
      fixture.componentRef.setInput('logoutRedirectUrl', '/login');

      component.logout();

      expect(navigateByUrl).toHaveBeenCalledWith('/login');
    },
  );

  it('does not navigate when already at the logout destination', () => {
    router.url = '/login';
    fixture.componentRef.setInput('logoutRedirectUrl', '/login');

    component.logout();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('does not log out or navigate when confirmation is declined', () => {
    confirm.mockReturnValue(of(false));

    component.logout();

    expect(logout).not.toHaveBeenCalled();
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
