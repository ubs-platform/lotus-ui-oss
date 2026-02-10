import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChatMessageDTO,
  ChatMessageStreamDTO,
  UserSendingMessageDto,
} from '@ubs-platform/superlama-common';
import { objectToQueryParameters } from '@lotus/front-global/object-to-query-parameters';
import { Observable } from 'rxjs';

export interface FindMessageInput {
  sessionId: string;
  beforeDate?: string;
  lastChatMessageId?: string;
}
@Injectable()
export class RealtimeChatService {
  private readonly serviceUrl = '/api/superlama/realtime-chat';
  listenerSse: { [key: string]: EventSource } = {};

  constructor(private httpClient: HttpClient) {}

  findMessagesBySessionId(f: FindMessageInput): Observable<ChatMessageDTO[]> {
    return this.httpClient
      .get<ChatMessageDTO[]>(`${this.serviceUrl}?${objectToQueryParameters(f)}`)
      .pipe();
  }

  sendMessage(f: UserSendingMessageDto): Observable<ChatMessageDTO> {
    return this.httpClient.post<ChatMessageDTO>(`${this.serviceUrl}`, f).pipe();
  }

  listenSession(sessionId: string) {
    if (this.listenerSse[sessionId] == null) {
      this.listenerSse[sessionId] = new EventSource(
        `${this.serviceUrl}/session/${sessionId}/listen`
      );
    }
    const sse = this.listenerSse[sessionId];

    const x = new Observable<ChatMessageStreamDTO>((subscriber) => {
      if (subscriber.closed) {
        sse.close();
      } else {
        sse.addEventListener('message', (ev) => {
          subscriber.next(JSON.parse(ev.data));
        });
        sse.addEventListener('error', (ev) => {
          subscriber.error(ev);
        });
      }
    });

    return x;
  }
}
