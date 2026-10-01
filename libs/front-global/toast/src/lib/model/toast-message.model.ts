export type ToastSeverity = 'info' | 'success' | 'warn' | 'error' | 'neutral';

export interface ToastMessageOptions {
  severity: ToastSeverity;
  summary?: string;
  detail?: string;
  sticky?: boolean;
  key?: string;
  life?: number;
}

export interface ToastMessage extends ToastMessageOptions {
  id: number;
  closing?: boolean;
}