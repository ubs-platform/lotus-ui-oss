import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

// const baseUrl = 'http://localhost:8080/api/tutorials';
export const CrudBaseServiceGenerator = <READ, WRITE, SEARCH extends Object>(
  _baseUrl: string, {cached = false} = {}
) => {
  class CrudBaseService {
    mapById: Record<string, READ> = {};
    allCache = new Map<string, READ[]>();
    inFlightById = new Map<any, Observable<READ>>();
    inFlightAll = new Map<string, Observable<READ[]>>();

    public http!: HttpClient;
    public baseUrl = _baseUrl;
    constructor(http: HttpClient) {
      this.http = http;
    }

    cacheById(item: READ | null | undefined) {
      const id = (item as any)?.id;
      if (id !== undefined && id !== null) {
        this.mapById[id] = item as READ;
      }
    }

    queryToString(o: any,): string {
      const query = Object.entries(o || {})
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      return '?' + query;
    }

    getAll(s?: Partial<SEARCH>): Observable<READ[]> {
      const search = this.queryToString(s);
      if (cached && this.allCache.has(search)) {
        return of(this.allCache.get(search) as READ[]);
      }
      if (cached && this.inFlightAll.has(search)) {
        return this.inFlightAll.get(search) as Observable<READ[]>;
      }
      const request$ = this.http.get<READ[]>(_baseUrl + search, { headers: { "current-run-cacheable": "true" } })
        .pipe(
          tap((items) => {
            if (!cached) {
              return;
            }
            this.allCache.set(search, items);
            items.forEach((item) => this.cacheById(item));
          }),
          finalize(() => this.inFlightAll.delete(search)),
          shareReplay(1),
        );
      if (cached) {
        this.inFlightAll.set(search, request$);
      }
      return request$;
    }

    search(s: SEARCH): Observable<READ> {
      const search = this.queryToString(s);
      return this.http.get<READ>(`${_baseUrl}/_search` + search, { headers: { "current-run-cacheable": "true" } });
    }

    get(id: any): Observable<READ> {
      if (cached && this.mapById[id]) {
        return of(this.mapById[id]);
      }
      if (cached && this.inFlightById.has(id)) {
        return this.inFlightById.get(id) as Observable<READ>;
      }
      const request$ = this.http.get<READ>(`${_baseUrl}/${id}`, { headers: { "current-run-cacheable": "true" } })
        .pipe(
          tap((item) => {
            if (cached) {
              this.cacheById(item);
            }
          }),
          finalize(() => this.inFlightById.delete(id)),
          shareReplay(1),
        );
      if (cached) {
        this.inFlightById.set(id, request$);
      }
      return request$;
    }

    create(data: WRITE): Observable<READ> {
      return this.http.post<READ>(_baseUrl, data)
        .pipe(tap((item) => {
          if (cached) {
            this.cacheById(item);
            this.allCache.clear();
          }
        }));
    }

    update(data: any): Observable<any> {
      return this.http.put<READ>(`${_baseUrl}`, data)
        .pipe(tap((item) => {
          if (cached) {
            this.cacheById(item);
            this.allCache.clear();
          }
        }));
    }

    delete(id: any): Observable<any> {
      return this.http.delete(`${_baseUrl}/${id}`)
        .pipe(tap(() => {
          if (cached) {
            delete this.mapById[id];
            this.allCache.clear();
          }
        }));
    }
  }

  return CrudBaseService;
};
