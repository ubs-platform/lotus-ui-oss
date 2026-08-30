import { CombinedEnvironment } from '@lotus/front-global/minky/core';
import { Injector } from '@angular/core';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

export const fetchCountries = (env: CombinedEnvironment) => {
  const cscdService = (env.app?.['injector'] as Injector).get(
    CscdClientService
  );

  return cscdService.getCountries().pipe(
    map((a) =>
      a.map((addr) => ({
        value: addr.code!,
        text: addr.name!,
      }))
    ),
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  );
};


export const fetchSubdivisions = (
  env: CombinedEnvironment,
  countryCode: string | null | undefined
) => {
  if (!countryCode) {
    return of([]);
  }
  const cscdService = (env.app?.['injector'] as Injector).get(
    CscdClientService
  );

  return cscdService.getSubdivisions(countryCode).pipe(
    map((a) =>
      a.map((addr) => ({
        value: addr.code!,
        text: addr.name!,
      }))
    ),
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  );
};


export const fetchLocalities = (
  env: CombinedEnvironment,
  countryCode: string | null | undefined,
  subdivCode: string | null | undefined
) => {
  if (!countryCode || !subdivCode) {
    return of([]);
  }
  const cscdService = (env.app?.['injector'] as Injector).get(
    CscdClientService
  );

  return cscdService.getLocalities(countryCode, subdivCode).pipe(
    map((a) =>
      a.map((addr) => ({
        value: addr.code!,
        text: addr.name!,
      }))
    ),
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  );
};


export const listenSubdivisions = (env: CombinedEnvironment, countryGetter: () => string) => {
  return env.state.onChanges!.pipe(
    map(() => countryGetter()),
    startWith(countryGetter()),
    distinctUntilChanged(),

    switchMap((countryCode) => fetchSubdivisions(env, countryCode)),
    
  );
};

export const listenLocalities = (env: CombinedEnvironment, countryGetter: () => string, subdivGetter: () => string) => {
  return env.state.onChanges!.pipe(
    map(() => ({ countryCode: countryGetter(), subdivCode: subdivGetter() })),
    startWith({ countryCode: countryGetter(), subdivCode: subdivGetter() }),
    distinctUntilChanged((a, b) => a.countryCode === b.countryCode && a.subdivCode === b.subdivCode),
    switchMap(({ countryCode, subdivCode }) => fetchLocalities(env, countryCode, subdivCode))
  );
};