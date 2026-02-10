import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChatMessageDTO,
  ChatMessageStreamDTO,
  ChatSessionDTO,
  UserSendingMessageDto,
} from '@ubs-platform/superlama-common';
import { SearchResult } from '@ubs-platform/crud-base-common';
import { map, Observable } from 'rxjs';
import { objectToQueryParameters } from '@lotus/front-global/object-to-query-parameters';

@Injectable()
export class SessionUserService {
  private readonly serviceUrl = '/api/superlama/session/current-user';

  constructor(private httpClient: HttpClient) {}

  fetchSessions(size: number, page: number) {
    return this.httpClient
      .get(`${this.serviceUrl}?${objectToQueryParameters({ size, page })}`)
      .pipe(map((a) => a as SearchResult<ChatSessionDTO>));
  }
}
