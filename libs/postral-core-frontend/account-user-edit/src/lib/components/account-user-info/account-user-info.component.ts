import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountControllerService,
  AddressControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  AccountForm,
} from '@lotus/postral-core-frontend/forms';
import { AccountDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { lastValueFrom, map, merge, mergeMap } from 'rxjs';
@Component({
  selector: 'lib-account-user-info',
  standalone: false,
  templateUrl: './account-user-info.component.html',
  styleUrl: './account-user-info.component.scss',
})
export class AccountUserInfoComponent {
  instruction = signal<FormEditInstruction | null>(null);
  accountId = signal<string>('');
  /**
   *
   */
  constructor(
    private accountService: AccountControllerService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private addressService: AddressControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const accountId = params['id'];
      if (accountId === 'new') {
        this.accountId.set(accountId);
        this.generateForm({} as AccountDTO);
        return;
      }
      this.accountService.get(accountId).subscribe((data) => {
        this.accountId.set(data.id || '');
        this.generateForm(data);
      });
    });
  }

  private generateForm(data: AccountDTO) {
    const form = new Reform(AccountForm, data);
    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert(
          'Validation Error',
          'Please check the form for errors and try again.',
          'error'
        );
      },
      beforeSave: (form: Reform) => true,
      saveMethod: (data) => {
        if (data.id) {
          return this.accountService.update(data);
        }
        return this.accountService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert(
          'Success',
          'postral.account-information-updated-su',
          'success'
        );
        if (this.accountId() === 'new') {
          this.router.navigate(['..', out.id], { relativeTo: this.activatedRoute, replaceUrl: true });
          return;
        }
        this.instruction.update((a) => {
          if (a) {
            //   // const form = new Reform(AccountForm);
            form.patchValue(out);
            //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { },
    } as FormEditInstruction<AccountDTO, AccountDTO>);
  }
}
