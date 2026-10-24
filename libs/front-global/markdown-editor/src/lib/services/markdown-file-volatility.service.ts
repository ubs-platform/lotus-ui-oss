import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarkdownFileVolatilityService {
  private _volatilityEvent = new Subject<void>();

  public volatilityEvent() {
    return this._volatilityEvent.pipe();
  }

  public notify() {
    this._volatilityEvent.next();
  }
}
