import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { CountryDTO, LocalityDTO, SubdivisionDTO } from '@ubs-platform/cscd-common';

@Injectable({
    providedIn: 'root',
})
export class CscdClientService {
    readonly baseUrl = '/service/cscd/api/cscd';
    private countriesCache$?: Observable<CountryDTO[]>;
    private readonly subdivisionsCache = new Map<string, Observable<SubdivisionDTO[]>>();
    private readonly subdivisionsMapCache = new Map<string, Observable<Map<string, SubdivisionDTO>>>();
    private readonly localitiesCache = new Map<string, Observable<LocalityDTO[]>>();
    private readonly localitiesMapCache = new Map<string, Observable<Map<string, LocalityDTO>>>();

    constructor(private readonly http: HttpClient) {}

    getCountries(): Observable<CountryDTO[]> {
        if (!this.countriesCache$) {
            this.countriesCache$ = this.http
                .get<CountryDTO[]>(`${this.baseUrl}/countries`)
                .pipe(
                    shareReplay({ bufferSize: 1, refCount: false })
                );
        }

        return this.countriesCache$;
    }

    getCountriesWithSubdivisions(): Observable<CountryDTO[]> {
        return this.getCountries().pipe(
            map((countries) => countries.filter((country) => country.hasSubdivisions === true))
        );
    }

    hasSubdivisions(countryCode: string): Observable<boolean> {
        if (!countryCode) {
            return new Observable<boolean>((observer) => {
                observer.next(false);
                observer.complete();
            });
        }
        return this.getCountriesWithSubdivisions().pipe(
            map((countries) => countries.some((country) => country.code === countryCode))
        );
    }

    getSubdivisions(countryCode: string): Observable<SubdivisionDTO[]> {
        if (!countryCode) {
            return new Observable<SubdivisionDTO[]>((observer) => {
                observer.next([]);
                observer.complete();
            });
        }
        let subdivisions$ = this.subdivisionsCache.get(countryCode);

        if (!subdivisions$) {
            subdivisions$ = this.http
                .get<SubdivisionDTO[]>(`${this.baseUrl}/countries/${countryCode}/subdivisions`)
                .pipe(shareReplay({ bufferSize: 1, refCount: false }));
            this.subdivisionsCache.set(countryCode, subdivisions$);
        }

        return subdivisions$;
    }

    getSubdivisionsMap(countryCode: string): Observable<Map<string, SubdivisionDTO>> {
        let subdivisionsMap$ = this.subdivisionsMapCache.get(countryCode);

        if (!subdivisionsMap$) {
            subdivisionsMap$ = this.getSubdivisions(countryCode).pipe(
                map((subdivisions) => this.toCodeMap(subdivisions)),
                shareReplay({ bufferSize: 1, refCount: false })
            );
            this.subdivisionsMapCache.set(countryCode, subdivisionsMap$);
        }

        return subdivisionsMap$;
    }

    getLocalities(countryCode: string, subdivisionCode: string): Observable<LocalityDTO[]> {
        if (!countryCode || !subdivisionCode) {
            return new Observable<LocalityDTO[]>((observer) => {
                observer.next([]);
                observer.complete();
            });
        }
        
        const cacheKey = `${countryCode}:${subdivisionCode}`;
        let localities$ = this.localitiesCache.get(cacheKey);

        if (!localities$) {
            localities$ = this.http
                .get<LocalityDTO[]>(`${this.baseUrl}/countries/${countryCode}/subdivisions/${subdivisionCode}/localities`)
                .pipe(shareReplay({ bufferSize: 1, refCount: false }));
            this.localitiesCache.set(cacheKey, localities$);
        }

        return localities$;
    }

    getLocalitiesMap(countryCode: string, subdivisionCode: string): Observable<Map<string, LocalityDTO>> {
        const cacheKey = `${countryCode}:${subdivisionCode}`;
        let localitiesMap$ = this.localitiesMapCache.get(cacheKey);

        if (!localitiesMap$) {
            localitiesMap$ = this.getLocalities(countryCode, subdivisionCode).pipe(
                map((localities) => this.toCodeMap(localities)),
                shareReplay({ bufferSize: 1, refCount: false })
            );
            this.localitiesMapCache.set(cacheKey, localitiesMap$);
        }

        return localitiesMap$;
    }

    private toCodeMap<T extends { code?: string }>(items: T[]): Map<string, T> {
        return new Map(
            items
                .filter((item): item is T & { code: string } => Boolean(item.code))
                .map((item) => [item.code, item])
        );
    }
}