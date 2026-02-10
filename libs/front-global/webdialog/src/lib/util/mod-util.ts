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

window.addEventListener('popstate', (e: PopStateEvent) => {
  console.info(window.history.state['index']);

  const currentFlagState = e.state['modalCloseFlag'];

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
      },
      closeMainAction: (value: any, applyGoBack: boolean = true) => {
        activeStates[newState].value = value;
        currentValue = value;
        if (!applyGoBack) {
          completeState(newState, value);
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
