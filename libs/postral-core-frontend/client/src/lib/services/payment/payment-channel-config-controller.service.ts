import { PaymentChannelConfigDTO } from '@tk-postral/payment-common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRequest, SearchResult } from '@ubs-platform/crud-base-common';

@Injectable({
  providedIn: 'root',
})
export class PaymentChannelConfigControllerService {
  readonly basePath = '/service/payment/api/payment-channel-config';

  constructor(private http: HttpClient) {}

  interceptUrl(url: string): string {
    return this.basePath + (!url || this.basePath.endsWith('/') ? '' : '/') + url;
  }

  findAllSearch(searchReq?: SearchRequest): Observable<SearchResult<PaymentChannelConfigDTO>> {
    let urlAltered = this.interceptUrl('_search');
    return this.http.get<SearchResult<PaymentChannelConfigDTO>>(urlAltered, { params: searchReq as any });
  }

  update(requestBody: PaymentChannelConfigDTO): Observable<PaymentChannelConfigDTO> {
    let urlAltered = this.interceptUrl('');
    return this.http.put<PaymentChannelConfigDTO>(urlAltered, requestBody);
  }

  removeById(id: string): Observable<void> {
    let urlAltered = this.interceptUrl(id);
    return this.http.delete<void>(urlAltered);
  }
}
