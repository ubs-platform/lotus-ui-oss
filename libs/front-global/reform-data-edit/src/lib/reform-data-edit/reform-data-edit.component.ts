import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { FormEditInstruction } from '../util/form-edit-instruction';
import { from, Observable, of } from 'rxjs';
import { FrontGlobalButtonModule } from "@lotus/front-global/button";

@Component({
  selector: 'lib-reform-data-edit',
  imports: [CommonModule, FormsModule, MinkyReformNgxPrimeModule, FrontGlobalButtonModule],
  templateUrl: './reform-data-edit.component.html',
  styleUrl: './reform-data-edit.component.css',
})
export class ReformDataEditComponent {

  formInstruction = input<FormEditInstruction>();

  toObservableThing<T>(data: T | Promise<T> | Observable<T>): Observable<T> {
    if (data instanceof Promise) {
      return from(data);
    }

    if (data instanceof Observable) {
      return data;
    }

    return of(data);
  }

  saveForm() {
    const i = this.formInstruction();
    if (!i) {
      return;
    }

    if (i.form.hasErrors()) {
      i.form.revealAllErrors();
      return;
    }

    this.toObservableThing(i.beforeSave(i.form)).subscribe((canSave) => {
      if (!canSave) {
        return;
      }

      this.toObservableThing(i.saveMethod(i.form.value)).subscribe({
        next: (saved) => i.afterSaveSuccess(saved, i.form.value),
        error: (err) => i.afterSaveError(err, i.form.value),
        complete: () => {}
      });
    });
  }
}