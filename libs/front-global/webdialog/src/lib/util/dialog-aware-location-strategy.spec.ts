import { PlatformLocation } from '@angular/common';
import {
  DialogInformation,
  generateMobileOptimizedDialogHideController,
  getCurrentDialogEntry,
  releaseOpenDialogs,
} from '@lotus/front-global/history-back-flag';
import { DialogAwareLocationStrategy } from './dialog-aware-location-strategy';

describe('DialogAwareLocationStrategy', () => {
  let strategy: DialogAwareLocationStrategy;
  let nowSpy: jest.SpyInstance;
  let now = 1_000;

  beforeEach(() => {
    DialogInformation.onMobile = true;
    // Her dialog benzersiz bir flag alsın.
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => ++now);
    window.history.replaceState({}, '', '/a');
    // Strategy'nin kullandığı kadarı; doğrudan window.history'ye bağlı.
    const platformLocation = {
      pushState: (s: any, t: string, u: string) =>
        window.history.pushState(s, t, u),
      replaceState: (s: any, t: string, u: string) =>
        window.history.replaceState(s, t, u),
      onPopState: (fn: (e: Event) => void) => {
        window.addEventListener('popstate', fn);
        return () => window.removeEventListener('popstate', fn);
      },
      onHashChange: () => () => undefined,
    } as unknown as PlatformLocation;
    strategy = new DialogAwareLocationStrategy(platformLocation, '/');
  });

  afterEach(() => nowSpy.mockRestore());

  it('pushes normally when the current entry is not a dialog entry', () => {
    const length = window.history.length;
    strategy.pushState({ navigationId: 1 }, '', '/b', '');
    expect(window.history.length).toBe(length + 1);
    expect(window.location.pathname).toBe('/b');
  });

  it('replaces the dialog entry and closes the dialog when the path changes', () => {
    const closed = jest.fn();
    generateMobileOptimizedDialogHideController(closed);
    const length = window.history.length;

    strategy.pushState({ navigationId: 2 }, '', '/b', '');

    expect(window.history.length).toBe(length);
    expect(window.location.pathname).toBe('/b');
    expect(closed).toHaveBeenCalledTimes(1);
    expect(getCurrentDialogEntry()).toBeNull();
  });

  it('keeps an open dialog and its entry on a query-only change', () => {
    const closed = jest.fn();
    generateMobileOptimizedDialogHideController(closed);
    const before = getCurrentDialogEntry();
    const length = window.history.length;

    strategy.pushState({ navigationId: 3 }, '', '/a?tab=2', '');

    expect(window.history.length).toBe(length);
    expect(window.location.search).toBe('?tab=2');
    expect(closed).not.toHaveBeenCalled();
    expect(getCurrentDialogEntry()).toEqual(before);
    expect(window.history.state.navigationId).toBe(3);
  });

  const nextPopState = () =>
    new Promise<PopStateEvent>((resolve) =>
      window.addEventListener('popstate', (e) => resolve(e), { once: true })
    );

  it('consumes the dialog entry on closeManually and hides it from the router', async () => {
    const closed = jest.fn();
    const routerListener = jest.fn();
    strategy.onPopState(routerListener);
    const length = window.history.length;
    const ref = generateMobileOptimizedDialogHideController(closed);

    const popped = nextPopState();
    ref.closeManually('value');
    expect(closed).toHaveBeenCalledWith('value');
    await popped;

    expect(window.location.pathname).toBe('/a');
    expect(getCurrentDialogEntry()).toBeNull();
    expect(routerListener).not.toHaveBeenCalled();

    // Sonraki gerçek popstate router'a ulaşmalı.
    strategy.pushState({ navigationId: 5 }, '', '/c', '');
    const back = nextPopState();
    window.history.back();
    await back;
    expect(routerListener).toHaveBeenCalledTimes(1);
    expect(window.history.length).toBe(length + 1);
  });

  it('defers a navigation started while the dialog entry is being consumed', async () => {
    const ref = generateMobileOptimizedDialogHideController(jest.fn());
    const length = window.history.length;

    const popped = nextPopState();
    ref.closeManually(undefined);
    strategy.pushState({ navigationId: 6 }, '', '/b', '');
    expect(window.location.pathname).toBe('/a');
    await popped;

    // [A, A'] → back → A → push B  ⇒  [A, B]
    expect(window.location.pathname).toBe('/b');
    expect(window.history.length).toBe(length);
    expect(window.history.state.navigationId).toBe(6);
  });

  it('overwrites a stale dialog entry without dialog fields', () => {
    const closed = jest.fn();
    generateMobileOptimizedDialogHideController(closed);
    // History'ye dokunmadan kapanan dialog bayat girdi bırakır.
    releaseOpenDialogs();
    closed.mockClear();
    const length = window.history.length;

    strategy.pushState({ navigationId: 4 }, '', '/a?tab=3', '');

    expect(window.history.length).toBe(length);
    expect(closed).not.toHaveBeenCalled();
    expect(getCurrentDialogEntry()).toBeNull();
  });
});
