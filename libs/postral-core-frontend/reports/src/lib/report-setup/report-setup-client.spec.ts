import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountControllerService } from '@lotus/postral-core-frontend/client';

describe('Report setup client contract', () => {
  let service: AccountControllerService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AccountControllerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('previews via the same-origin account endpoint with currency as a query parameter', () => {
    service.previewReportSetup('seller', 'TRY').subscribe();
    const request = http.expectOne('/service/payment/api/account/seller/report-setup?currency=TRY');
    expect(request.request.method).toBe('GET');
    request.flush({ accountId: 'seller', currency: 'TRY', existing: [], created: [], missing: ['DAILY', 'MONTHLY', 'YEARLY'] });
  });

  it('posts only currency and selected periods, preserving the payment proxy API prefix', () => {
    const input = { currency: 'USD', dateGroupings: ['DAILY' as const, 'MONTHLY' as const] };
    service.setupReports('seller', input).subscribe();
    const request = http.expectOne('/service/payment/api/account/seller/report-setup');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);
    request.flush({ accountId: 'seller', currency: 'USD', existing: [], created: [], missing: ['YEARLY'] });
  });
});
