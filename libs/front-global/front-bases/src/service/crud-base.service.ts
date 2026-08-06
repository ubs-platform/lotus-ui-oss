import { inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, shareReplay } from 'rxjs/operators';
import { SearchResult } from '@ubs-platform/crud-base-common';

// const baseUrl = 'http://localhost:8080/api/tutorials';
export const CrudBaseServiceGenerator = <READ, WRITE, SEARCH extends Object>(
  _baseUrl: string
) => {
  class CrudBaseService {
    inFlightById = new Map<any, Observable<READ>>();
    inFlightAll = new Map<string, Observable<READ[]>>();

    public http!: HttpClient;
    public baseUrl = _baseUrl;
    constructor(http: HttpClient) {
      this.http = http;
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
      if (this.inFlightAll.has(search)) {
        return this.inFlightAll.get(search) as Observable<READ[]>;
      }
      const request$ = this.http.get<READ[]>(_baseUrl + search)
        .pipe(
          finalize(() => this.inFlightAll.delete(search)),
          shareReplay(1),
        );
      this.inFlightAll.set(search, request$);
      return request$;
    }

    search(s: SEARCH): Observable<SearchResult<READ>> {
      const search = this.queryToString(s);
      return this.http.get<SearchResult<READ>>(`${_baseUrl}/_search` + search);
    }

    get(id: any): Observable<READ> {
      if (this.inFlightById.has(id)) {
        return this.inFlightById.get(id) as Observable<READ>;
      }
      const request$ = this.http.get<READ>(`${_baseUrl}/${id}`)
        .pipe(
          finalize(() => this.inFlightById.delete(id)),
          shareReplay(1),
        );
      this.inFlightById.set(id, request$);
      return request$;
    }

    create(data: WRITE): Observable<READ> {
      return this.http.post<READ>(_baseUrl, data);
    }

    update(data: any): Observable<any> {
      return this.http.put<READ>(`${_baseUrl}`, data);
    }

    delete(id: any): Observable<any> {
      return this.http.delete(`${_baseUrl}/${id}`);
    }
  }

  return CrudBaseService;
};
