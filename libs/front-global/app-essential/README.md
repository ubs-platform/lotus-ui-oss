# front-global-app-essential

This library was generated with [Nx](https://nx.dev).

## Application setup

Use `provideFrontGlobal` once in the root `AppModule.providers` or standalone
`ApplicationConfig.providers`:

```ts
import turkish from '@angular/common/locales/tr';
import { provideFrontGlobal } from '@lotus/front-global/app-essential';

provideFrontGlobal({
  language: 'tr-tr',
  localeData: turkish,
  translationUrls: [(language: string) => `localization/${language}.json`],
});
```

This configures `HttpClient` with DI interceptors, including the existing
`AuthModule` authentication/loading interceptor, and the translation URL token.
The interceptor's loading-indication service is root-provided, so this setup does
not require a loading UI module. It registers Angular locale data and initializes
the translation environment before application initializers, respecting the saved
language. The theme service
is instantiated at application startup so saved theme settings are applied even
without a theme control on screen. Locale registration does not override Angular's
`LOCALE_ID`; applications can provide that token separately if needed.

Do not also import `AuthModule` or repeat the HTTP setup in applications using
this provider. Translation, dialog, header-state, index-loader and markdown
volatility services are root-provided; explicit application-level service
registrations are unnecessary. Existing local service overrides still work.

UI imports remain explicit: this provider does not import/export template
dependencies. Routing, change-detection configuration, service workers and
application-specific providers also stay in the owning application. No base
application class or standalone migration is required.

## Header logout navigation

`GenericAppHeaderComponent` navigates to `/` after logout by default. Applications
whose homepage requires authentication can set `logoutRedirectUrl="/login"` so
the header does not override a protected page's login redirect.

## Running unit tests

Run `nx test front-global-app-essential` to execute the unit tests.
