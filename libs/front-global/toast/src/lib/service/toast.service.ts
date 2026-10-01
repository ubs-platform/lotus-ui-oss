import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastMessageOptions } from '../model/toast-message.model';

const DEFAULT_LIFE = 3000;
const EXIT_DURATION = 180;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesState = signal<ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly removalTimers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly messages = this.messagesState.asReadonly();

  add(options: ToastMessageOptions): void {
    const message: ToastMessage = { ...options, id: ++this.nextId };
    this.messagesState.update((messages) => [...messages, message]);

    if (!message.sticky) {
      const timer = setTimeout(
        () => this.dismiss(message.id),
        Math.max(0, message.life ?? DEFAULT_LIFE)
      );
      this.timers.set(message.id, timer);
    }
  }

  clear(key?: string): void {
    const messagesToRemove = this.messagesState().filter(
      (message) => key === undefined || message.key === key
    );
    messagesToRemove.forEach((message) => {
      this.clearTimer(message.id);
      this.clearRemovalTimer(message.id);
    });
    this.messagesState.update((messages) =>
      messages.filter((message) => !messagesToRemove.includes(message))
    );
  }

  dismiss(id: number): void {
    const message = this.messagesState().find((item) => item.id === id);
    if (!message || message.closing) return;

    this.clearTimer(id);
    this.messagesState.update((messages) =>
      messages.map((item) =>
        item.id === id ? { ...item, closing: true } : item
      )
    );

    this.removalTimers.set(
      id,
      setTimeout(() => {
        this.clearRemovalTimer(id);
        this.messagesState.update((messages) =>
          messages.filter((item) => item.id !== id)
        );
      }, EXIT_DURATION)
    );
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) clearTimeout(timer);
    this.timers.delete(id);
  }

  private clearRemovalTimer(id: number): void {
    const timer = this.removalTimers.get(id);
    if (timer !== undefined) clearTimeout(timer);
    this.removalTimers.delete(id);
  }
}