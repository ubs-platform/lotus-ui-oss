import { Component, signal } from '@angular/core';
import { AddressControllerService } from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  AddressDtoWithUserInput,
  AddressForm,
} from '@lotus/postral-core-frontend/forms';
import { AccountAddressDto } from '@tk-postral/payment-common';
import {
  addressFromBackend,
  addressToBackend,
} from '@lotus/postral-core-frontend/forms';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CscdClientService } from 'libs/front-global/cscd-client/src/lib/cscd-client.service';
@Component({
  selector: 'lib-address-info',
  standalone: false,
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss'],
})
export class AddressInfoComponent {
  instruction = signal<FormEditInstruction | null>(null);
  addressId = signal<string>('');
  /**
   *
   */
  constructor(
    private addressService: AddressControllerService,
    private cscdService: CscdClientService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const addressId = params['id'];
      if (addressId === 'new') {
        this.addressId.set(addressId);
        this.generateForm({} as AccountAddressDto);
        return;
      }
      this.addressService.get(addressId).subscribe((data) => {
        this.addressId.set(data.id || '');
        this.generateForm(data);
      });
    });
  }

  private async generateForm(data: AccountAddressDto) {
    const userInputValues = await addressFromBackend(data, this.cscdService);
    this.generateFormWithUserInput({ ...data, ...userInputValues });
  }

  private generateFormWithUserInput(data: AddressDtoWithUserInput) {
    const form = new Reform<Partial<AddressDtoWithUserInput>>(
      AddressForm,
      data,
    );

    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert(
          'Validation Error',
          'Please check the form for errors and try again.',
          'error',
        );
      },
      beforeValidation: async (form: Reform) => {
        const userInput = form.value as AddressDtoWithUserInput;
        form.patchValue(await addressToBackend(userInput, this.cscdService));
      },
      teamSelectionRequired: (data) => !data.id,
      teamSelectionDialog: {
        title: 'Takım seçimi',
        description:
          'Yeni adres için sahip belirtilmesi gerekiyor. Bunu sonradan değiştiremezsiniz, bu nedenle doğru seçtiğinizden emin olun.',
      },
      onTeamSelected: (result, data) => {
        data.entityOwnershipGroupId = result.usePersonalInsteadTeam
          ? undefined
          : result.selectedTeamId;
      },
      saveMethod: (data) => {
        if (data.id) {
          return this.addressService.update(data);
        }
        return this.addressService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert(
          'general.success',
          'postral.address.saved',
          'success',
        );
        if (this.addressId() === 'new') {
          this.router.navigate(['..', out.id], {
            relativeTo: this.activatedRoute,
            replaceUrl: true,
          });
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
      afterSaveError: (error, data) => {},
    } as FormEditInstruction<AccountAddressDto, AccountAddressDto>);
  }
}
