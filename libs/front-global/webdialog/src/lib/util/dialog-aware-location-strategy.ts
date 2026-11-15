import { Injectable, Provider } from '@angular/core';
import {
  LocationChangeListener,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import {
  getCurrentDialogEntry,
  isConsumedDialogPopState,
  releaseOpenDialogs,
  runWhenDialogHistorySettled,
} from '@lotus/front-global/history-back-flag';

/**
 * Mobilde dialog açılınca eklenen history girdisinin (dialogOpen) router
 * navigasyonlarında bayat kalmasını engeller. Angular router geçmişe yalnızca
 * buradan yazdığı için routerLink, navigate, navigateByUrl ve guard'lar dahil
 * tüm navigasyonlar kapsanır.
 *
 * - Dialog girdisindeyken path değişirse: açık dialoglar history'ye dokunmadan
 *   kapatılır ve yeni sayfa dialog girdisinin yerine yazılır (push yerine replace).
 * - Yalnızca query/hash değişirse ve dialog açıksa: dialog açık kalır, girdi
 *   dialog alanları korunarak replace edilir.
 * - Dialog programatik kapatılıp girdisi `history.back()` ile tüketilirken:
 *   o popstate router'a iletilmez (devam eden navigasyonu iptal etmesin) ve
 *   gelen yazmalar back() tamamlanana kadar bekletilir.
 *
 * Kullanım: app providers içine `provideDialogAwareHistory()`.
 */
@Injectable()
export class DialogAwareLocationStrategy extends PathLocationStrategy {
  override onPopState(fn: LocationChangeListener): void {
    super.onPopState((event) => {
      if (!isConsumedDialogPopState(event as unknown as Event)) {
        fn(event);
      }
    });
  }

  override pushState(
    state: any,
    title: string,
    url: string,
    queryParams: string
  ): void {
    runWhenDialogHistorySettled(() => {
      if (!this.writeOverDialogEntry(state, title, url, queryParams)) {
        super.pushState(state, title, url, queryParams);
      }
    });
  }

  override replaceState(
    state: any,
    title: string,
    url: string,
    queryParams: string
  ): void {
    runWhenDialogHistorySettled(() => {
      if (!this.writeOverDialogEntry(state, title, url, queryParams)) {
        super.replaceState(state, title, url, queryParams);
      }
    });
  }

  /** Şu anki girdi dialog girdisi değilse false döner ve hiçbir şey yapmaz. */
  private writeOverDialogEntry(
    state: any,
    title: string,
    url: string,
    queryParams: string
  ): boolean {
    const entry = getCurrentDialogEntry();
    if (entry == null) {
      return false;
    }
    if (entry.active && !this.leavesCurrentPath(url)) {
      super.replaceState({ ...state, ...entry.state }, title, url, queryParams);
    } else {
      releaseOpenDialogs();
      super.replaceState(state, title, url, queryParams);
    }
    return true;
  }

  private leavesCurrentPath(url: string): boolean {
    const targetPath = this.prepareExternalUrl(url).split(/[?#]/)[0];
    return targetPath !== window.location.pathname;
  }
}

export const provideDialogAwareHistory = (): Provider => ({
  provide: LocationStrategy,
  useClass: DialogAwareLocationStrategy,
});
