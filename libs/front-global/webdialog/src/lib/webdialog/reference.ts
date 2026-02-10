import { Subject, Subscription } from 'rxjs';
import { WebdialogComponent } from './webdialog.component';
import { OutputRefSubscription } from '@angular/core';

export class WebdialogReference<OUT_VALUE> {
  private _dialogComponent!: WebdialogComponent;
  private currentValue?: OUT_VALUE;
  private closeSubject = new Subject<OUT_VALUE | undefined | null>();
  closeSubscription?: OutputRefSubscription;
  completed = false;

  assertNotCompleted() {
    if (this.completed) throw { message: 'Webdialog Reference is completed' };
  }

  onClose() {
    this.assertNotCompleted();
    return this.closeSubject.asObservable();
  }

  setCurrentValue(value: OUT_VALUE) {
    this.assertNotCompleted();
    this.currentValue = value;
  }

  setComponent(wd: WebdialogComponent) {
    this.assertNotCompleted();
    this.closeSubscription?.unsubscribe();
    this._dialogComponent = wd;
    this.closeSubscription = wd.showChange.subscribe((a) => {
      if (!a) {
        this.closeSubject.next(this.currentValue);
        this.closeSubject.complete();
      }
    });
  }

  close(value?: OUT_VALUE) {
    this.assertNotCompleted();
    if (value) {
      this.setCurrentValue(value);
    }
    this._dialogComponent.closeDialogByReference();
  }
}
