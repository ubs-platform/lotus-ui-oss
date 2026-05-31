import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateRefundRequestDTO,
  RefundRequestDTO,
  RefundRequestSearchDTO,
} from '@tk-postral/payment-common';

@Injectable({
  providedIn: 'root',
})
export class RefundControllerService {
  readonly basePath = '/service/payment/api/refund';
  
  constructor(private http: HttpClient) {}

  interceptUrl(url: string): string {
    return (
      this.basePath + (!url || this.basePath.endsWith('/') ? '' : '/') + url
    );
  }

  createRefundRequest(requestBody: CreateRefundRequestDTO): Observable<RefundRequestDTO> {
    const urlAltered = this.interceptUrl('request');
    return this.http.post<RefundRequestDTO>(urlAltered, requestBody);
  }

  approveRefundRequest(id: string): Observable<RefundRequestDTO> {
    const urlAltered = this.interceptUrl(`request/${id}/approve`);
    return this.http.post<RefundRequestDTO>(urlAltered, {});
  }

  rejectRefundRequest(id: string): Observable<RefundRequestDTO> {
    const urlAltered = this.interceptUrl(`request/${id}/reject`);
    return this.http.post<RefundRequestDTO>(urlAltered, {});
  }

  searchRefundRequests(searchBody: RefundRequestSearchDTO): Observable<{ data: RefundRequestDTO[], total: number }> {
    const urlAltered = this.interceptUrl(`request/_search`);
    return this.http.post<{ data: RefundRequestDTO[], total: number }>(urlAltered, searchBody);
  }

  getRefundRequestById(id: string): Observable<RefundRequestDTO> {
    const urlAltered = this.interceptUrl(`request/${id}`);
    return this.http.get<RefundRequestDTO>(urlAltered);
  }
}
