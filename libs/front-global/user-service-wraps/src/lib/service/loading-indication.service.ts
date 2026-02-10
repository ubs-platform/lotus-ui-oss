import { Injectable } from '@angular/core';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import {
  Observable,
  OperatorFunction,
  ReplaySubject,
  Subject,
  debounceTime,
  of,
} from 'rxjs';
import { MessageInput } from '../dto/error-input';
import { LoadingData } from '../dto/loading-indicator-data';
import { LoadingIndicatorState } from '../dto/loading-indicator-state';
@Injectable()
export class LoadingIndicationService {
  private loadingIndicationChange = new ReplaySubject<LoadingIndicatorState>(1);
  private _list: { [key: string]: LoadingData | undefined } = {};

  constructor() {
    this.loadingIndicationChange.next(new LoadingIndicatorState(false));
  }

  hideAll() {
    const entries = Object.keys(this._list);
    entries.forEach((key) => {
      this.closeAndReturnSelfObs(key);
    });
  }

  register(lid: LoadingData) {
    const key = lid.name;
    if (lid.show) {
      this._list[key] = lid;
    } else {
      this._list[key] = undefined;
    }

    const ls = Object.values(this._list).filter((a) => a);

    if (ls.length) {
      const a = ls[0];
      this.loadingIndicationChange.next(
        new LoadingIndicatorState(true, a!.title, a!.progressValue)
      );
    } else {
      this.loadingIndicationChange.next(new LoadingIndicatorState(false));
    }

    return {
      close: () => {
        return this.register({ ...lid, show: false });
      },

      closeAndReturnSelfObs: () => {
        return this.closeAndReturnSelfObs(lid.name);
      },
    };
  }

  closeAndReturnSelfObs<DATA>(name: string): OperatorFunction<DATA, DATA> {
    this.register(new LoadingData(name, false));
    return (d) => d;
  }

  getObservable(): Observable<LoadingIndicatorState> {
    return this.loadingIndicationChange.pipe(debounceTime(50));
  }
}
