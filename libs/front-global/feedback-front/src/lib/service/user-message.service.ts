import { Injectable } from '@angular/core';
import { CrudBaseServiceGenerator } from '@lotus/front-global/front-bases';
// import { IUserMessageDto } from '../dto/user-message.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '@lotus-web/environment';
import { map } from 'rxjs';
import {
  IUserMessageDto,
  IUserMessageSearch,
} from '@ubs-platform/feedback-common';
// import { IUserMessageSearch } from '../dto/user-message.search';
@Injectable()
export class UserMessageService extends CrudBaseServiceGenerator<
  IUserMessageDto,
  IUserMessageDto,
  IUserMessageSearch
>(`${environment.feedbackUrl}user-message`) {
  constructor(h: HttpClient) {
    super(h);
  }

  resolve(id: string, data: { reply: string }) {
    return this.http
      .post(`${this.baseUrl}/${id}/resolve`, data)
      .pipe(map((a) => a as IUserMessageDto));
  }
}
