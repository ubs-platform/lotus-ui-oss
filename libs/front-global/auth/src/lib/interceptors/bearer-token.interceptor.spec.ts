import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';
import { TokenGetter } from '../common/token-getter';
import { RequestInterceptor } from './bearer-token.interceptor';

describe('RequestInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let openLoadings: Set<string>;

  beforeEach(() => {
    openLoadings = new Set();
    RequestInterceptor.inflightGetMap.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: TokenGetter, useValue: { getToken: () => 'token' } },
        {
          provide: LoadingIndicationService,
          useValue: {
            register: (data: { name: string }) => {
              openLoadings.add(data.name);
              return { close: () => openLoadings.delete(data.name) };
            },
          },
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    RequestInterceptor.inflightGetMap.clear();
  });

  it('closes loading after a successful response', () => {
    http.get('/api/a').subscribe();
    expect(openLoadings.size).toBe(1);

    controller.expectOne('/api/a').flush({});

    expect(openLoadings.size).toBe(0);
    expect(RequestInterceptor.inflightGetMap.size).toBe(0);
  });

  it('closes loading after an error response', () => {
    http.post('/api/has-role', []).subscribe({ error: () => undefined });

    controller
      .expectOne('/api/has-role')
      .flush('denied', { status: 403, statusText: 'Forbidden' });

    expect(openLoadings.size).toBe(0);
  });

  it('closes loading and clears the in-flight entry when the request is cancelled', () => {
    const subscription = http.get('/api/a').subscribe();
    const request = controller.expectOne('/api/a');

    subscription.unsubscribe();

    expect(request.cancelled).toBe(true);
    expect(openLoadings.size).toBe(0);
    expect(RequestInterceptor.inflightGetMap.size).toBe(0);
  });

  it('shares concurrent identical GET requests', () => {
    const results: unknown[] = [];
    http.get('/api/a').subscribe((value) => results.push(value));
    http.get('/api/a').subscribe((value) => results.push(value));

    controller.expectOne('/api/a').flush({ ok: true });

    expect(results).toEqual([{ ok: true }, { ok: true }]);
    expect(openLoadings.size).toBe(0);
  });

  it('keeps a shared GET alive while another subscriber is waiting', () => {
    const first = http.get('/api/a').subscribe();
    http.get('/api/a').subscribe();
    const request = controller.expectOne('/api/a');

    first.unsubscribe();

    expect(request.cancelled).toBe(false);
    expect(openLoadings.size).toBe(1);
    request.flush({});
    expect(openLoadings.size).toBe(0);
  });

  it('tracks loading separately for concurrent non-GET requests to the same URL', () => {
    http.post('/api/a', {}).subscribe();
    http.post('/api/a', {}).subscribe();
    const [first, second] = controller.match('/api/a');

    first.flush({});
    expect(openLoadings.size).toBe(1);

    second.flush({});
    expect(openLoadings.size).toBe(0);
  });
});
