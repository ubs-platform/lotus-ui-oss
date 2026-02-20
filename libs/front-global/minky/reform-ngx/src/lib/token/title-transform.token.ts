import { InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ConverterMethod = (s: string) => Observable<string>;

export class TitleTransform {
  currentTransform: ConverterMethod = (s) => of(s);
}

export const TITLE_TRANSFORM = new InjectionToken('TITLE_TRANSFORM', {
  factory() {
    return new TitleTransform();
  },
});
