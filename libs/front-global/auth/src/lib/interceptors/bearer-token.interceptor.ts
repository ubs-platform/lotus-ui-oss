import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize, share } from 'rxjs';
import { bearerTokenInterceptorGetReady as bearerTokenInterceptorGetReady } from './bearer-token-ready';
import { TokenGetter } from '../common/token-getter';
import {
  LoadingData,
  LoadingIndicationService,
} from '@lotus/front-global/user-service-wraps';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  static inflightGetMap = new Map<string, Observable<HttpEvent<unknown>>>();
  private static loadingSequence = 0;
  constructor(
    private tokenGetter: TokenGetter,
    private loadingService: LoadingIndicationService,
  ) {
    bearerTokenInterceptorGetReady.next(true);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenGetter.getToken();

    const cachedUrlKey = request.urlWithParams + ' token:' + token;
    const isGet = request.method.toUpperCase() === 'GET';
    if (isGet && RequestInterceptor.inflightGetMap.has(cachedUrlKey)) {
      return RequestInterceptor.inflightGetMap.get(cachedUrlKey)!;
    } else if (
      isGet == false &&
      RequestInterceptor.inflightGetMap.has(cachedUrlKey)
    ) {
      // Invalidate GET cache on non-GET requests
      RequestInterceptor.inflightGetMap.delete(cachedUrlKey);
    }
    const cacheableOnCurrentRun = isGet; //&& request.headers.get('current-run-cacheable') != 'true';
    const silentLoading = request.headers.get('loading-indicator') == 'silent';
    let loading = silentLoading
      ? null
      : this.loadingService.register(
          new LoadingData(
            `${cachedUrlKey} #${++RequestInterceptor.loadingSequence}`,
            true,
          ),
        );

    const authorizedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    // finalize runs on complete, error and unsubscribe (e.g. switchMap/route cancel);
    // placed before share() so it fires once when the last subscriber leaves.
    const handledRequest = next.handle(authorizedRequest).pipe(
      finalize(() => {
        loading?.close();
        loading = null;
        if (
          cacheableOnCurrentRun &&
          RequestInterceptor.inflightGetMap.get(cachedUrlKey) === handledRequest
        ) {
          RequestInterceptor.inflightGetMap.delete(cachedUrlKey);
        }
      }),
      share(),
    );

    if (cacheableOnCurrentRun) {
      RequestInterceptor.inflightGetMap.set(cachedUrlKey, handledRequest);
    }

    return handledRequest;
  }
}
