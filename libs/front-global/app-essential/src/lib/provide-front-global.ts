import { registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  provideEnvironmentInitializer,
} from '@angular/core';
import { EnvironmentController } from '@lotus/extra/translator-core';
import { LANGUAGE_JSON_URL } from '@lotus/extra/ubs-translator-ngx';
import { AuthModule } from '@lotus/front-global/auth';
import { ThemeManager } from '@lotus/front-global/theme-management';

export interface FrontGlobalOptions {
  language: string;
  localeData: Parameters<typeof registerLocaleData>[0];
  translationUrls: Array<(language: string) => string>;
}

export function provideFrontGlobal(
  options: FrontGlobalOptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(AuthModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LANGUAGE_JSON_URL, useValue: options.translationUrls },
    provideEnvironmentInitializer(() => {
      registerLocaleData(options.localeData);
      EnvironmentController.getEnvironmentController(options.language, true);
    }),
    provideAppInitializer(() => {
      inject(ThemeManager);
    }),
  ]);
}
