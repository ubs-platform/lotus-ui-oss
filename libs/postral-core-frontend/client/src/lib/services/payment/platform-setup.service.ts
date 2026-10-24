import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  PlatformSetupAccountDTO,
  PlatformSetupCompleteDTO,
  PlatformSetupSettingsDTO,
  PlatformSetupStatusDTO,
} from '@tk-postral/payment-common';

@Injectable({ providedIn: 'root' })
export class PlatformSetupClientService {
  private readonly http = inject(HttpClient);
  readonly basePath = '/service/payment/api/platform-setup';

  status() {
    return this.http.get<PlatformSetupStatusDTO>(this.basePath);
  }
  team(name: string) {
    return this.http.post<PlatformSetupStatusDTO>(`${this.basePath}/team`, {
      name,
    });
  }
  account(input: PlatformSetupAccountDTO, seller: boolean) {
    return this.http.post<PlatformSetupStatusDTO>(
      `${this.basePath}/${seller ? 'seller-account' : 'platform-account'}`,
      input,
    );
  }
  settings(input: PlatformSetupSettingsDTO) {
    return this.http.post<PlatformSetupStatusDTO>(
      `${this.basePath}/settings`,
      input,
    );
  }
  complete(input: PlatformSetupCompleteDTO = {}) {
    return this.http.post<PlatformSetupStatusDTO>(
      `${this.basePath}/complete`,
      input,
    );
  }
  keepExisting() {
    return this.http.post<PlatformSetupStatusDTO>(
      `${this.basePath}/keep-existing`,
      {},
    );
  }
}
