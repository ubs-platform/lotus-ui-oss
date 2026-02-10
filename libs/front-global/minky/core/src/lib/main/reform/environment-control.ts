import { Observable, of } from 'rxjs';

export interface IEnvironmentControl {
  textTransform(input: string): Observable<string>;
}

export class DefaultEnvironmentControl implements IEnvironmentControl {
  textTransform(input: string): Observable<string> {
    return of(input);
  }
}
