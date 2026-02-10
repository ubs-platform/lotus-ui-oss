import { Observable } from 'rxjs';

export type FeederItem = { text: string; value: any; textPrefix?: string };
export type ListFunction = () =>
  | Promise<FeederItem[]>
  | Observable<FeederItem[]>
  | FeederItem[];
// export class SelectFeeder {
//   constructor(public path: string, ) {}
// }
// export type SelectFeeder = ListFunction;