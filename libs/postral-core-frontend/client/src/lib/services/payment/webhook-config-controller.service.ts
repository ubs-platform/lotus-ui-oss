import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebhookConfigCreateDTO, WebhookConfigDTO, WebhookConfigUpdateDTO } from '@tk-postral/payment-common';

@Injectable({
  providedIn: 'root'
})
export class WebhookConfigControllerService {
  readonly basePath = '/service/payment/api/webhook-config';

  constructor(private http: HttpClient) {}

  getByAccountId(accountId: string): Observable<WebhookConfigDTO> {
    return this.http.get<WebhookConfigDTO>(this.basePath, { params: { accountId } });
  }

  create(requestBody: WebhookConfigCreateDTO): Observable<WebhookConfigDTO> {
    return this.http.post<WebhookConfigDTO>(this.basePath, requestBody);
  }

  update(id: string, requestBody: WebhookConfigUpdateDTO): Observable<WebhookConfigDTO> {
    return this.http.put<WebhookConfigDTO>(`${this.basePath}/${id}`, requestBody);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
