import { Injectable, Inject } from '@angular/core';
import { TranslatorText } from '@ubs-platform/translator-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
@Injectable({ providedIn: "root" })
export class HeaderCommunicationService {
    private headerTitle = new ReplaySubject<TranslatorText>(1);
    private topMinimalTitle = new ReplaySubject<TranslatorText>(1);

    setHeaderTitle(title: TranslatorText): void {
        this.headerTitle.next(title);
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