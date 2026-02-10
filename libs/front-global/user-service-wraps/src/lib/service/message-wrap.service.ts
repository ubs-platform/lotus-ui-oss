import { Injectable } from '@angular/core';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { Subject } from 'rxjs';
import { MessageInput } from '../dto/error-input';
@Injectable()
export class MessageWrapService {
  private _errorSubject = new Subject<MessageInput>();

  constructor() {}

  showMessage(ei: MessageInput) {
    this._errorSubject.next({ ...ei });
  }

  closeMessage(ei: MessageInput) {
    this._errorSubject.next({ ...ei });
  }

  getObservable() {
    return this._errorSubject.pipe();
  }
}
