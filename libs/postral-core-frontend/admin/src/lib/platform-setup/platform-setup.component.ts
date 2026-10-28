import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  EMPTY,
  Observable,
  catchError,
  defer,
  finalize,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { CscdClientService } from '@lotus/front-global/cscd-client';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  FormEditInstruction,
  ReformDataEditComponent,
} from '@lotus/front-global/reform-data-edit';
import { PlatformSetupClientService } from '@lotus/postral-core-frontend/client';
import {
  AccountForm,
  AddressForm,
  addressToBackend,
} from '@lotus/postral-core-frontend/forms';
import {
  AccountDTO,
  PlatformSetupStatusDTO,
  PlatformSetupStep,
} from '@tk-postral/payment-common';
import {
  PlatformSettingsForm,
  PlatformChannelsForm,
  PlatformTeamForm,
  setupSettings,
} from './platform-setup.form';
import { OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
import { IconComponent } from '@lotus/front-global/icon';
import { NgTemplateOutlet } from '@angular/common';

export type PlatformSetupScreen =
  | 'WELCOME'
  | 'TEAM'
  | 'ADDRESS'
  | 'ACCOUNT'
  | 'OWNERSHIP'
  | 'SETTINGS'
  | 'REVIEW'
  | 'COMPLETED';

@Component({
  selector: 'lib-platform-setup',
  imports: [
    ReformDataEditComponent,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    RouterLink,
    OnpageHeaderComponent,
    IconComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './platform-setup.component.html',
  styleUrl: './platform-setup.component.scss',
})
export class PlatformSetupComponent implements OnInit {
  private readonly client = inject(PlatformSetupClientService);
  private readonly cscd = inject(CscdClientService);
  private readonly overlay = inject(BasicOverlayService);
  private readonly destroyRef = inject(DestroyRef);
  private accountDraft?: AccountForm;
  readonly state = signal<PlatformSetupStatusDTO | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly preparing = signal(false);
  readonly busy = computed(
    () => this.saving() || this.loading() || this.preparing(),
  );
  readonly error = signal('');
  readonly serverError = signal('');
  /** Set once the user leaves the welcome screen; the backend only records progress after the team is saved. */
  readonly started = signal(false);
  readonly address = signal<AddressForm | null>(null);
  readonly shareAddress = signal(false);
  readonly teamForm = signal<FormEditInstruction<
    PlatformTeamForm,
    PlatformSetupStatusDTO
  > | null>(null);
  readonly addressForm = signal<FormEditInstruction<
    AddressForm,
    AddressForm
  > | null>(null);
  readonly accountForm = signal<FormEditInstruction<
    AccountForm,
    PlatformSetupStatusDTO
  > | null>(null);
  readonly settingsForm = signal<FormEditInstruction<
    PlatformSettingsForm,
    PlatformSetupStatusDTO
  > | null>(null);
  readonly channelsForm = signal<FormEditInstruction<
    PlatformChannelsForm,
    PlatformSetupStatusDTO
  > | null>(null);
  readonly editor = viewChild(ReformDataEditComponent);
  readonly steps: PlatformSetupStep[] = [
    'TEAM',
    'PLATFORM',
    'SETTINGS',
    'SELLER',
    'REVIEW',
  ];
  readonly visibleSteps = computed(() => {
    const state = this.state();
    if (!state) return [];
    return this.steps.filter(
      (step) => step !== 'SELLER' || !!state.settings?.alsoSells,
    );
  });
  readonly summaryLines = computed(() => {
    const state = this.state();
    if (!state) return [];
    const lines: Array<[PlatformSetupStep, string | undefined]> = [
      ['TEAM', state.teamName],
      ['PLATFORM', state.platformAccountName],
      ['SELLER', state.sellerAccountName],
    ];
    return lines
      .filter((line): line is [PlatformSetupStep, string] => !!line[1])
      .map(([step, value]) => ({ step, value }));
  });
  readonly accountAlreadySaved = computed(() => {
    const state = this.state();
    return !!(state?.step === 'SELLER'
      ? state.sellerAccountId
      : state?.platformAccountId);
  });
  /** The single screen rendered by the template; PLATFORM/SELLER split into address, account and ownership-repair phases. */
  readonly screen = computed<PlatformSetupScreen | null>(() => {
    const state = this.state();
    if (!state) return null;
    if (state.status === 'COMPLETED') return 'COMPLETED';
    if (
      !this.started() &&
      (state.status === 'NOT_STARTED' || state.legacyAvailable)
    )
      return 'WELCOME';
    switch (state.step) {
      case 'PLATFORM':
      case 'SELLER':
        if (this.accountAlreadySaved()) return 'OWNERSHIP';
        return this.accountForm() ? 'ACCOUNT' : 'ADDRESS';
      default:
        return state.step;
    }
  });

  ngOnInit(): void {
    this.load();

  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.serverError.set('');
    this.client
      .status()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (state) => this.applyState(state),
        error: (error) =>
          this.failed(error, 'postral.platform-setup.load-error'),
      });
  }

  start(): void {
    this.started.set(true);
  }

  keepExisting(): void {
    this.perform(this.client.keepExisting());
  }
  finish(): void {
    this.perform(this.complete(this.channelsForm()?.form.value));
  }

  repairOwnership(): void {
    this.perform(
      this.client.account(
        { account: new AccountDTO() },
        this.state()?.step === 'SELLER',
      ),
    );
  }

  usePlatformAddress(): void {
    this.shareAddress.set(true);
    this.makeAccountForm();
  }

  editAddress(): void {
    this.accountDraft = this.accountForm()?.form.value;
    this.shareAddress.set(false);
    this.accountForm.set(null);
    this.makeAddressForm();
  }

  private applyState(state: PlatformSetupStatusDTO): void {
    this.state.set(state);
    this.teamForm.set(null);
    this.addressForm.set(null);
    this.accountForm.set(null);
    this.settingsForm.set(null);
    this.channelsForm.set(null);
    this.address.set(null);
    this.accountDraft = undefined;
    this.shareAddress.set(false);
    if (state.step === 'TEAM') {
      if (state.legacyAvailable) return;
      const form = new Reform(
        PlatformTeamForm,
        Object.assign(new PlatformTeamForm(), { name: state.teamName ?? '' }),
      );
      if (state.teamName) form.setDisableByPath('name', true);
      this.teamForm.set(
        this.instruction(
          form,
          (data) => this.client.team(data.name),
          (out) => this.applyState(out),
        ),
      );
    } else if (state.step === 'SETTINGS') {
      const form = new Reform(PlatformSettingsForm, new PlatformSettingsForm());
      this.settingsForm.set(
        this.instruction(
          form,
          (data) => this.client.settings(setupSettings(data)),
          (out) => this.applyState(out),
        ),
      );
    } else if (state.step === 'REVIEW') {
      this.channelsForm.set(
        this.instruction(
          new Reform(PlatformChannelsForm, new PlatformChannelsForm()),
          (data) => this.complete(data),
          (out) => this.applyState(out),
        ),
      );
    } else if (state.step === 'PLATFORM' || state.step === 'SELLER') {
      if (!this.accountAlreadySaved()) this.makeAddressForm();
    }
  }

  private complete(
    channels?: PlatformChannelsForm,
  ): Observable<PlatformSetupStatusDTO> {
    return this.client.complete({
      paymentChannelIds: channels?.dummyEcommerce ? ['dummy-ecommerce'] : [],
    });
  }

  private makeAddressForm(): void {
    const initial = Object.assign(
      new AddressForm(),
      { countryCodeUserInput: 'TR' },
      this.address() ?? {},
    );
    const form = new Reform(AddressForm, initial);
    const instruction = this.instruction<AddressForm, AddressForm>(
      form,
      (data) => of(data),
      (data) => {
        this.address.set(data);
        this.addressForm.set(null);
        this.makeAccountForm();
      },
    );
    instruction.beforeValidation = (current) => {
      if (this.busy()) return EMPTY;
      this.preparing.set(true);
      return defer(() => addressToBackend(current.value, this.cscd)).pipe(
        switchMap((fields) => {
          current.patchValue(fields);
          if (!fields.country || !fields.cityName) {
            this.error.set('postral.platform-setup.validation-error');
            return EMPTY;
          }
          return of(undefined);
        }),
        catchError((error) => {
          this.failed(error, 'postral.platform-setup.save-error');
          return EMPTY;
        }),
        finalize(() => this.preparing.set(false)),
      );
    };
    this.addressForm.set(instruction);
  }

  private makeAccountForm(): void {
    this.addressForm.set(null);
    const form = new Reform(
      AccountForm,
      this.accountDraft ?? new AccountForm(),
    );
    for (const path of [
      'id',
      'type',
      'defaultAddressId',
      'bankName',
      'bankIban',
      'bankBic',
      'bankSwift',
    ]) {
      form.setHiddenByPath(path, true);
      form.setDisableByPath(path, true);
    }
    this.accountForm.set(
      this.instruction(
        form,
        (data) =>
          this.client.account(
            {
              account: data,
              address: this.shareAddress()
                ? undefined
                : (this.address() ?? undefined),
              usePlatformAddress: this.shareAddress(),
            },
            this.state()?.step === 'SELLER',
          ),
        (out) => this.applyState(out),
      ),
    );
  }

  private instruction<T, R>(
    form: Reform<T>,
    save: (data: T) => Observable<R>,
    done: (out: R) => void,
  ): FormEditInstruction<T, R> {
    return {
      form,
      onValidationError: () =>
        this.overlay.alert(
          'general.error',
          'postral.platform-setup.validation-error',
          'error',
        ),
      beforeSave: () => !this.saving() && !this.loading(),
      saveMethod: (data) => {
        if (this.saving() || this.loading())
          return throwError(
            () => new Error('Setup operation is already running'),
          );
        this.saving.set(true);
        this.error.set('');
        this.serverError.set('');
        return save(data).pipe(finalize(() => this.saving.set(false)));
      },
      afterSaveSuccess: done,
      afterSaveError: (error) =>
        this.failed(error, 'postral.platform-setup.save-error'),
    };
  }

  private perform(action: Observable<PlatformSetupStatusDTO>): void {
    if (this.saving() || this.loading()) return;
    this.saving.set(true);
    this.error.set('');
    this.serverError.set('');
    action
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (state) => this.applyState(state),
        error: (error) =>
          this.failed(error, 'postral.platform-setup.save-error'),
      });
  }

  private failed(error: unknown, key: string): void {
    this.error.set(key);
    if (
      error instanceof HttpErrorResponse &&
      typeof error.error?.message === 'string'
    ) {
      this.serverError.set(error.error.message);
    }
  }


  ngOnDestroy() {
  
  }
}
