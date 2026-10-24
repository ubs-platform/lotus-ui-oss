import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  isSignal,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEditInstruction } from '../util/form-edit-instruction';
import {
  ReformDataEditAction,
  ReformDataEditCondition,
} from '../util/reform-data-edit-action';
import {
  EMPTY,
  from,
  isObservable,
  map,
  mergeMap,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  TeamSelectionDialogComponent,
  TeamSelectionDialogData,
  TeamSelectionResult,
} from '@lotus/front-global/team-selection-dialog';

@Component({
  selector: 'lib-reform-data-edit',
  imports: [CommonModule, FormsModule, MinkyReformNgxPrimeModule, FrontGlobalButtonModule],
  templateUrl: './reform-data-edit.component.html',
  styleUrls: ['./reform-data-edit.component.css'],
})
export class ReformDataEditComponent {

  saveButtonPosition = input<'top-right' | 'bottom' | 'hidden'>('top-right');
  formInstruction = input<FormEditInstruction>();

  private observableConditions = signal(
    new Map<Observable<boolean>, boolean>()
  );
  private conditionSubscriptions = new Map<Observable<boolean>, Subscription>();
  private basicOverlay = inject(BasicOverlayService, { optional: true });

  constructor() {
    effect(() => {
      const actions = this.formInstruction()?.extraActions ?? [];
      untracked(() => this.syncObservableConditions(actions));
    });

    inject(DestroyRef).onDestroy(() => {
      this.conditionSubscriptions.forEach((s) => s.unsubscribe());
      this.conditionSubscriptions.clear();
    });
  }

  visibleActions() {
    const instruction = this.formInstruction();
    if (!instruction) {
      return [];
    }
    return (instruction.extraActions ?? []).filter((a) =>
      this.resolveCondition(a.renderIf, true)
    );
  }

  isActionDisabled(action: ReformDataEditAction) {
    return this.resolveCondition(action.disabled, false);
  }

  runAction(action: ReformDataEditAction) {
    const instruction = this.formInstruction();
    if (!instruction || this.isActionDisabled(action)) {
      return;
    }
    action.action(instruction.form);
  }

  private syncObservableConditions(actions: ReformDataEditAction[]) {
    const current = new Set<Observable<boolean>>();
    for (const action of actions) {
      for (const condition of [action.renderIf, action.disabled]) {
        if (isObservable(condition)) {
          current.add(condition);
        }
      }
    }

    this.conditionSubscriptions.forEach((sub, source) => {
      if (!current.has(source)) {
        sub.unsubscribe();
        this.conditionSubscriptions.delete(source);
        this.updateObservableCondition(source, undefined);
      }
    });

    current.forEach((source) => {
      if (this.conditionSubscriptions.has(source)) {
        return;
      }
      this.conditionSubscriptions.set(
        source,
        source.subscribe((value) =>
          this.updateObservableCondition(source, value)
        )
      );
    });
  }

  private updateObservableCondition(
    source: Observable<boolean>,
    value: boolean | undefined
  ) {
    this.observableConditions.update((map) => {
      const next = new Map(map);
      if (value === undefined) {
        next.delete(source);
      } else {
        next.set(source, value);
      }
      return next;
    });
  }

  private resolveCondition(
    condition: ReformDataEditCondition | undefined,
    fallback: boolean
  ): boolean {
    if (condition == null) {
      return fallback;
    }
    if (typeof condition === 'boolean') {
      return condition;
    }
    if (isObservable(condition)) {
      return this.observableConditions().get(condition) ?? fallback;
    }
    if (isSignal(condition)) {
      return condition();
    }
    return condition(this.formInstruction()!.form);
  }

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

    this.toObservableThing(i.beforeValidation?.(i.form) ?? of(undefined)).subscribe(() => {

      if (i.form.hasErrors()) {
        i.form.revealAllErrors();
        return;
      }

      this.toObservableThing(i.beforeSave?.(i.form) ?? of(true)).subscribe((canSave) => {
        if (!canSave) {
          return;
        }

        this.resolveTeamSelection(i, i.form.value)
          .pipe(mergeMap((data) => this.toObservableThing(i.saveMethod(data))))
          .subscribe({
            next: (saved) => i.afterSaveSuccess(saved, i.form.value),
            error: (err) => i.afterSaveError(err, i.form.value),
            complete: () => { }
          });
      });
    });
  }

  private isTeamSelectionRequired<T>(i: FormEditInstruction<T>, data: T) {
    if (!i.onTeamSelected) {
      return false;
    }
    const required = i.teamSelectionRequired;
    if (required == null) {
      return true;
    }
    return typeof required === 'function' ? required(data) : required;
  }

  /** Emits the data to save, or completes without emitting when the dialog is cancelled. */
  private resolveTeamSelection<T>(i: FormEditInstruction<T>, data: T): Observable<T> {
    const onTeamSelected = i.onTeamSelected;
    if (!onTeamSelected || !this.isTeamSelectionRequired(i, data)) {
      return of(data);
    }
    if (!this.basicOverlay) {
      throw new Error(
        'ReformDataEditComponent: BasicOverlayService is required for team selection.'
      );
    }

    return this.basicOverlay
      .showComponentAsDialog<TeamSelectionDialogData, TeamSelectionResult | null>(
        TeamSelectionDialogComponent,
        {
          data: { description: i.teamSelectionDialog?.description },
          title: i.teamSelectionDialog?.title,
          defaultOutValue: null,
        }
      )
      .onClose()
      .pipe(
        mergeMap((result?: TeamSelectionResult | null) => {
          if (!result) {
            return EMPTY;
          }
          return this.toObservableThing(onTeamSelected(result, data)).pipe(
            map((replacement) => (replacement ?? data) as T)
          );
        })
      );
  }
}