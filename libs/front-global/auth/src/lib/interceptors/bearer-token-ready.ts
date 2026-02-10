import { ReplaySubject } from 'rxjs';

export const bearerTokenInterceptorGetReady = new ReplaySubject<boolean>(1);
