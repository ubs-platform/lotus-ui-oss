import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { bearerTokenInterceptorGetReady as bearerTokenInterceptorGetReady } from './bearer-token-ready';
import { TokenGetter } from '../common/token-getter';
import {
  LoadingData,
  LoadingIndicationService,
} from '@lotus/front-global/user-service-wraps';
import { OverlayService } from 'primeng/api';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  static inflightGetMap = new Map<string, Observable<HttpEvent<unknown>>>();

  constructor(
    private tokenGetter: TokenGetter,
    private loadingService: LoadingIndicationService
  ) {
    bearerTokenInterceptorGetReady.next(true);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const cachedUrlKey = request.urlWithParams;
    const isGet = request.method.toUpperCase() === 'GET';
    if (isGet && RequestInterceptor.inflightGetMap.has(cachedUrlKey)) {
      return RequestInterceptor.inflightGetMap.get(cachedUrlKey)!;
    } else if (isGet == false) {
      // Invalidate GET cache on non-GET requests
      RequestInterceptor.inflightGetMap.delete(cachedUrlKey);
    }
    const cacheableOnCurrentRun = isGet; //&& request.headers.get('current-run-cacheable') != 'true';
    const silentLoading = request.headers.get('loading-indicator') == 'silent';
    let loadingSt: { close: () => {} } | undefined | null = null;
    if (!silentLoading) {
      loadingSt = this.loadingService.register(
        new LoadingData(cachedUrlKey, true)
      );
    }

    const token = this.tokenGetter.getToken();

    const authorizedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    const handledRequest = next.handle(authorizedRequest).pipe(
      map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (loadingSt && evt instanceof HttpResponse) {
          loadingSt.close();
        }
        if (!cacheableOnCurrentRun) {
          RequestInterceptor.inflightGetMap.delete(cachedUrlKey);
        }
        return evt;
      }),
      catchError((err) => {
        RequestInterceptor.inflightGetMap.delete(cachedUrlKey);

        if (err.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          // this.overlay.alert('Bilinmeyen bir hata oluştu', '', 'error');
          alert('Bilinmeyen bir hata oluştu');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          // this.overlay.alert("Maalesef bir hata oluştu")
          // console.error(
          //   `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.

        loadingSt?.close();
        return throwError(() => err);
      })
    );

    RequestInterceptor.inflightGetMap.set(cachedUrlKey, handledRequest);

    return handledRequest;
  }
}
