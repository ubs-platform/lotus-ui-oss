import { ReplaySubject, Subject } from 'rxjs';

export const WebDialogUtils = {
  infoAlertForBackIssue: () => {},
};

export const calculateIsMobile = (): boolean => {
  //todo: releaseden önce kaldır
  // return true;
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  /**Nodejste değilse, ekran küçükse ya da sistem gerçekten mobil bir os ise */
  return (
    //@ts-ignore
    typeof process != 'object' &&
    (innerWidth < 992 || regex.test(navigator.userAgent))
  );
};

export interface DialogVisibilityReference<VALUE = any> {
  closeManually(value: VALUE): void;
  closeMainAction(value: VALUE, applyGoBack?: boolean): void;
}
const _onMobileAsync = new ReplaySubject<boolean>(1);
export const DialogInformation = {
  onMobile: false,
  onMobileAsync: _onMobileAsync.asObservable(),
};
DialogInformation.onMobile = calculateIsMobile();
_onMobileAsync.next(DialogInformation.onMobile);

window.addEventListener('resize', () => {
  DialogInformation.onMobile = calculateIsMobile();
  _onMobileAsync.next(DialogInformation.onMobile);
});

const activeStates: {
  [key: number]: {
    completed: boolean;
    defaultValue: any;
    value?: any;
    backActionComplete: (value: any) => void;
  };
} = {};

let latestFlag = 0;
let latestIndex = window.history?.state?.index || 0;

function completeState(state: any, value?: any) {
  const act = activeStates[state];
  if (act && !act.completed) {
    if (value != null) {
      act.backActionComplete(value);
    } else if (act.value != null) {
      act.backActionComplete(act.value);
    } else {
      act.backActionComplete(value);
    }
    act.completed = true;
    // window.history.replaceState({}, '31');
    latestFlag = Date.now();
  }
}

export const insertIndexForUrlNavigation = () => {
  if (window.history.state.index == null) {
    window.history.replaceState(
      { ...window.history.state, index: latestIndex },
      '31'
    );
    latestIndex++;
  }
};

export interface DialogHistoryEntry {
  /** Girdiye bağlı dialogun `modalCloseFlag` değeri. */
  flag: number;
  /** Dialog hâlâ açıksa true; kapandıysa girdi bayattır. */
  active: boolean;
  /** Girdi başka bir state ile değiştirilirken korunması gereken alanlar. */
  state: {
    modalCloseFlag: number;
    dialogOpen: true;
    closeDialog?: boolean;
    index?: number;
  };
}

/**
 * Şu anki history girdisi bir dialog için eklenen girdi ise (dialogOpen) bilgisini,
 * değilse null döner.
 */
export const getCurrentDialogEntry = (): DialogHistoryEntry | null => {
  const s = window.history.state;
  if (s == null || s['dialogOpen'] !== true || s['modalCloseFlag'] == null) {
    return null;
  }
  const flag = s['modalCloseFlag'];
  const act = activeStates[flag];
  return {
    flag,
    active: act != null && !act.completed,
    state: {
      modalCloseFlag: flag,
      dialogOpen: true,
      ...(s['closeDialog'] != null ? { closeDialog: s['closeDialog'] } : {}),
      ...(s['index'] != null ? { index: s['index'] } : {}),
    },
  };
};

/**
 * Açık tüm dialogları history'ye dokunmadan (back/forward çağırmadan) kapatır.
 * Sayfadan ayrılırken dialog girdisinin üzerine yazılacağı zaman kullanılır;
 * böylece geri gelindiğinde `closeDialog` girdisi ölü bir dialogu tetiklemez.
 */
export const releaseOpenDialogs = () => {
  Object.keys(activeStates)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach((flag) => completeState(flag));
};

/**
 * Programatik kapatmada dialog girdisini `history.back()` ile tüketme durumu.
 * Tüketme sürerken gelen history yazmaları `runWhenDialogHistorySettled` ile
 * bekletilir; aksi halde back() traversal'ı yeni yazılan girdiden geri gider.
 */
const CONSUMED_POPSTATE_MARK = '__dialogEntryConsumed';
/** popstate hiç gelmezse bekleyenleri serbest bırakmak için güvenlik süresi. */
const CONSUME_FALLBACK_MS = 1000;
let consumePending: ReturnType<typeof setTimeout> | null = null;
const settleWaiters: Array<() => void> = [];

function finishConsume() {
  if (consumePending == null) {
    return;
  }
  clearTimeout(consumePending);
  consumePending = null;
  settleWaiters.splice(0).forEach((fn) => fn());
}

/** Şu anki girdi bu dialogun girdisiyse onu geri giderek geçmişten çıkarır. */
function consumeDialogEntry(flag: number) {
  const s = window.history.state;
  if (
    consumePending != null ||
    s?.['dialogOpen'] !== true ||
    s['modalCloseFlag'] !== flag
  ) {
    return;
  }
  consumePending = setTimeout(finishConsume, CONSUME_FALLBACK_MS);
  window.history.back();
}

/**
 * Popstate, programatik kapatmada dialog girdisini tüketmek için bizim
 * yaptığımız `history.back()` sonucuysa true döner. Router bunu görmemelidir;
 * görürse devam eden navigasyonu iptal eder.
 */
export const isConsumedDialogPopState = (e: Event): boolean =>
  (e as unknown as Record<string, unknown>)[CONSUMED_POPSTATE_MARK] === true;

/** Dialog girdisi tüketiliyorsa bitince, değilse hemen çalıştırır. */
export const runWhenDialogHistorySettled = (fn: () => void) => {
  if (consumePending != null) {
    settleWaiters.push(fn);
  } else {
    fn();
  }
};

window.addEventListener('popstate', (e: PopStateEvent) => {
  if (consumePending != null) {
    (e as unknown as Record<string, unknown>)[CONSUMED_POPSTATE_MARK] = true;
    finishConsume();
    return;
  }

  const currentFlagState = e.state?.['modalCloseFlag'];

  if (currentFlagState) {
    const act = activeStates[currentFlagState];
    if (act != null && !act.completed && e.state['closeDialog']) {
      completeState(currentFlagState);
    } else if (window.history.state.dialogOpen) {
      const index = window.history.state['index'];

      if (index > latestIndex) {
        // latestIndex = index;

        console.info('Acceleration forward');
        history.forward();
        latestIndex = index + 1;
      } else if (index < latestIndex) {
        // latestIndex = index;

        console.info('Acceleration back');
        history.back();
        latestIndex = index - 1;
      }
    }
  }
});

export const generateMobileOptimizedDialogHideController = <VALUE = any>(
  backActionComplete: (value: any) => void,
  defaultValue?: any
): DialogVisibilityReference => {
  let currentValue = defaultValue;
  if (DialogInformation.onMobile) {
    const newState = Date.now();

    const completionAction = {
      closeManually: (value: VALUE) => {
        completeState(newState, value);
        consumeDialogEntry(newState);
      },
      closeMainAction: (value: any, applyGoBack: boolean = true) => {
        activeStates[newState].value = value;
        currentValue = value;
        if (!applyGoBack) {
          completeState(newState, value);
          consumeDialogEntry(newState);
        } else {
          window.history.back();
        }
      },
    } as DialogVisibilityReference;
    const existState = window.history.state;
    window.history.replaceState(
      {
        ...existState,
        modalCloseFlag: newState,
        closeDialog: true,
        index: latestIndex,
      },
      '31'
    );
    latestIndex++;
    window.history.pushState(
      {
        ...existState,
        index: latestIndex,
        dialogOpen: true,
        modalCloseFlag: newState,
      },
      '31'
    );
    latestIndex++;
    // latestIndex++;

    activeStates[newState] = {
      defaultValue,
      completed: false,
      backActionComplete: (v) => backActionComplete(v),
    };
    return completionAction;
  } else {
    return {
      closeMainAction: (v) => {
        backActionComplete(v);
      },
      closeManually: (v) => {
        backActionComplete(v);
      },
    };
  }
};
