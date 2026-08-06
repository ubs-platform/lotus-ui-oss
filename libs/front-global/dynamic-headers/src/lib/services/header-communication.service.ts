import { Injectable, Inject } from '@angular/core';
import { TranslatorText } from '@ubs-platform/translator-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IIcon } from '@lotus/front-global/icon-type';

export interface HeaderAction extends IIcon {
  stringContent?: string;
  action: () => void;
}

@Injectable({ providedIn: "root" })
export class HeaderCommunicationService {

    private headerBackAction = new ReplaySubject<HeaderAction | null>(1);
    private headerTitle = new ReplaySubject<TranslatorText>(1);
    private topMinimalTitle = new ReplaySubject<TranslatorText>(1);

    setHeaderTitle(title: TranslatorText): void {
        this.headerTitle.next(title);
    }

    setHeaderBackAction(action: HeaderAction | null): void {
        this.headerBackAction.next(action);
    }

    getHeaderBackAction(): Observable<HeaderAction | null> {
        return this.headerBackAction.asObservable();
    }

    getHeaderTitle(): Observable<TranslatorText> {
        return this.headerTitle.asObservable();
    }

    setTopMinimalTitle(title: TranslatorText): void {
        this.topMinimalTitle.next(title);
    }

    getTopMinimalTitle(): Observable<TranslatorText> {
        return this.topMinimalTitle.asObservable();
    }   
}