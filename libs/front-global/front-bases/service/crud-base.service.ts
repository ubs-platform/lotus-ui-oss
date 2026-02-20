import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// const baseUrl = 'http://localhost:8080/api/tutorials';
export const CrudBaseServiceGenerator = <READ, WRITE, SEARCH extends Object>(
  _baseUrl: string
) => {
  class TutorialService {
    public http!: HttpClient;
    public baseUrl = _baseUrl;
    constructor(http: HttpClient) {
      this.http = http;
    }

    queryToString(o: SEARCH) {
      const query = Object.entries(o)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      return '?' + query;
    }

    getAll(s: SEARCH): Observable<READ[]> {
      const search = this.queryToString(s);
      return this.http.get<READ[]>(_baseUrl + search);
    }

    search(s: SEARCH): Observable<READ> {
      const search = this.queryToString(s);
      return this.http.get<READ>(`${_baseUrl}/_search` + search);
    }

    get(id: any): Observable<READ> {
      return this.http.get<READ>(`${_baseUrl}/${id}`);
    }

    create(data: WRITE): Observable<READ> {
      return this.http.post<READ>(_baseUrl, data);
    }

    update(data: any): Observable<any> {
      return this.http.put(`${_baseUrl}`, data);
    }

    delete(id: any): Observable<any> {
      return this.http.delete(`${_baseUrl}/${id}`);
    }
  }

  return TutorialService;
};
