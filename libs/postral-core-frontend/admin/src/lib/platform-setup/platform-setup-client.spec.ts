import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PlatformSetupClientService } from '@lotus/postral-core-frontend/client/platform-setup';
import { setupSettings, PlatformSettingsForm } from './platform-setup.form';

describe('Platform setup client', () => {
  let client: PlatformSetupClientService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    client = TestBed.inject(PlatformSetupClientService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('posts selected channel IDs as part of completion, not as separate channel CRUD calls', () => {
    const input = { paymentChannelIds: ['dummy-ecommerce'] };
    client.complete(input).subscribe();
    const request = http.expectOne(
      '/service/payment/api/platform-setup/complete',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);
    request.flush({});
  });

  it('keeps requests same-origin with the payment /api prefix', () => {
    client.status().subscribe();
    const status = http.expectOne('/service/payment/api/platform-setup');
    expect(status.request.method).toBe('GET');
    status.flush({ status: 'NOT_STARTED' });
    client.team('Admin team').subscribe();
    const team = http.expectOne('/service/payment/api/platform-setup/team');
    expect(team.request.body).toEqual({ name: 'Admin team' });
    team.flush({});
    const config = setupSettings(new PlatformSettingsForm());
    client.settings(config).subscribe();
    const settings = http.expectOne(
      '/service/payment/api/platform-setup/settings',
    );
    expect(settings.request.body).toEqual(config);
    settings.flush({});
    client.complete().subscribe();
    http.expectOne('/service/payment/api/platform-setup/complete').flush({});
    client.keepExisting().subscribe();
    http
      .expectOne('/service/payment/api/platform-setup/keep-existing')
      .flush({});
  });
});
