import { getLocaleId } from '@angular/common';
import turkish from '@angular/common/locales/tr';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EnvironmentInjector, createEnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnvironmentController } from '@lotus/extra/translator-core';
import {
  LANGUAGE_JSON_URL,
  TranslatorRepositoryService,
} from '@lotus/extra/ubs-translator-ngx';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';
import { CustomHeaderHolderService } from '@lotus/front-global/ui/page-container';
import { WebdialogHandler } from '@lotus/front-global/webdialog';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';
import { RequestInterceptor, TOKEN_FIELD } from '@lotus/front-global/auth';
import { provideFrontGlobal } from './provide-front-global';

jest.mock('../../../webdialog/src/lib/webdialog/webdialog.component', () => ({
  WebdialogComponent: class {},
}));

describe('provideFrontGlobal', () => {
  const translationUrl = (language: string): string =>
    `localization/${language}.json`;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('amoled', 'true');
    RequestInterceptor.inflightGetMap.clear();
    TestBed.configureTestingModule({
      providers: [
        provideFrontGlobal({
          language: 'tr-tr',
          localeData: turkish,
          translationUrls: [translationUrl],
        }),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    RequestInterceptor.inflightGetMap.clear();
    localStorage.clear();
    document.documentElement.removeAttribute('theme');
    document.documentElement.removeAttribute('amoled');
    jest.restoreAllMocks();
  });

  it('initializes the language environment and registers Angular locale data', () => {
    const initializeLanguage = jest.spyOn(
      EnvironmentController,
      'getEnvironmentController',
    );

    TestBed.inject(EnvironmentInjector);

    expect(initializeLanguage).toHaveBeenCalledWith('tr-tr', true);
    expect(getLocaleId('tr')).toBe('tr');
  });

  it('provides the configured translation URLs and a root translation repository', () => {
    expect(TestBed.inject(LANGUAGE_JSON_URL)).toEqual([translationUrl]);
    expect(TestBed.inject(LANGUAGE_JSON_URL)[0]('en-us')).toBe(
      'localization/en-us.json',
    );
    expect(TestBed.inject(TranslatorRepositoryService)).toBeInstanceOf(
      TranslatorRepositoryService,
    );
    TestBed.inject(HttpTestingController)
      .expectOne('localization/tr-tr.json')
      .flush([]);
  });

  it('applies the saved theme at startup without a component injecting it', () => {
    TestBed.inject(EnvironmentInjector);

    expect(document.documentElement.getAttribute('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('amoled')).toBe('true');
    expect(TestBed.inject(ThemeManager).theme).toBe('dark');
  });

  it('registers the authentication interceptor once and uses it for HTTP requests', () => {
    localStorage.setItem(TOKEN_FIELD, 'front-global-test-token');
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(
      interceptors.filter(
        (interceptor) => interceptor instanceof RequestInterceptor,
      ),
    ).toHaveLength(1);

    TestBed.inject(HttpClient).post('/api/front-global-test', {}).subscribe();

    const request = TestBed.inject(HttpTestingController).expectOne(
      '/api/front-global-test',
    );
    expect(request.request.headers.get('Authorization')).toContain(
      'front-global-test-token',
    );
    request.flush({});
  });

  it('shares root services with child injectors without explicit service providers', () => {
    const parent = TestBed.inject(EnvironmentInjector);
    const child = createEnvironmentInjector([], parent);
    try {
      expect(child.get(IndexAutoLoader)).toBe(parent.get(IndexAutoLoader));
      expect(child.get(LoadingIndicationService)).toBe(
        parent.get(LoadingIndicationService),
      );
      expect(child.get(CustomHeaderHolderService)).toBe(
        parent.get(CustomHeaderHolderService),
      );
      expect(child.get(WebdialogHandler)).toBe(parent.get(WebdialogHandler));
      expect(child.get(TranslatorRepositoryService)).toBe(
        parent.get(TranslatorRepositoryService),
      );
      TestBed.inject(HttpTestingController)
        .expectOne('localization/tr-tr.json')
        .flush([]);
    } finally {
      child.destroy();
    }
  });
});
