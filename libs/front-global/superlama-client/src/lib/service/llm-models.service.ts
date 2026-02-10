import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChatMessageDTO,
  ChatMessageStreamDTO,
  LlmModelDto,
  UserSendingMessageDto,
} from '@ubs-platform/superlama-common';
import { map, Observable } from 'rxjs';

@Injectable()
export class LlmModelsService {
  private readonly serviceUrl = '/api/superlama/llm-models';
  constructor(private httpClient: HttpClient) {}

  fetchModels() {
    return this.httpClient
      .get(this.serviceUrl)
      .pipe(map((a) => a as LlmModelDto[]));
  }
}
