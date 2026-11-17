export type XDrawNotification = { translationKey: string } | { text: string };

export interface XDrawNotifier {
    warning(notification: XDrawNotification, durationMs: number): void;
}

const consoleNotifier: XDrawNotifier = {
    warning: (notification) =>
        console.warn("[xdraw]", "translationKey" in notification ? notification.translationKey : notification.text),
};

let activeNotifier: XDrawNotifier = consoleNotifier;

/** Core UI'dan bagimsizdir; uygulama katmani toast + ceviri yapan kendi notifier'ini burada kaydeder. */
export function setXDrawNotifier(notifier: XDrawNotifier | null): void {
    activeNotifier = notifier ?? consoleNotifier;
}

export function xdrawNotifier(): XDrawNotifier {
    return activeNotifier;
}
