import { ReplaySubject } from 'rxjs';

const onlineStatusReplaySub = new ReplaySubject<boolean>(1);
addEventListener('online', () => onlineStatusReplaySub.next(true));
addEventListener('offline', () => onlineStatusReplaySub.next(false));
onlineStatusReplaySub.next(navigator.onLine);
export const onlineStatus = onlineStatusReplaySub.pipe();
