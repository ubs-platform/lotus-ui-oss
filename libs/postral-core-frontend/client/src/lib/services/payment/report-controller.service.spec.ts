import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SellerReportSeriesSearchDTO } from '@tk-postral/payment-common';
import { ReportControllerService } from './report-controller.service';

describe('ReportControllerService seller series', () => {
  let service: ReportControllerService;
  let http: HttpTestingController;
  const filters: SellerReportSeriesSearchDTO = {
    accountId: 'seller',
    currency: 'TRY',
    dateGrouping: 'DAILY',
    reportSize: 7,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReportControllerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each([true, false, 'true', 'false'] as const)(
    'forwards skipUnavailableReports=%j as a query parameter',
    skipUnavailableReports => {
      service.sellerSeries({ ...filters, skipUnavailableReports }).subscribe();
      const request = http.expectOne(req => req.url === `${service.baseUrl}/seller-series`);
      expect(request.request.params.get('skipUnavailableReports')).toBe(String(skipUnavailableReports));
      request.flush({});
    },
  );

  it('omits the optional parameter for existing callers', () => {
    service.sellerSeries(filters).subscribe();
    const request = http.expectOne(req => req.url === `${service.baseUrl}/seller-series`);
    expect(request.request.params.has('skipUnavailableReports')).toBe(false);
    request.flush({});
  });
});
