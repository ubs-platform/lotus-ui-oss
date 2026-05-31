import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountControllerService, AccountUserControllerService, AddressControllerService } from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { AccountForm, AddressForm } from '@lotus/postral-core-frontend/forms';
import { AccountDTO, AccountAddressDto } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
@Component({
  selector: 'lib-account-user-info',
  standalone: false,
  templateUrl: './address-info.component.html',
  styleUrl: './address-info.component.scss',
})
export class AddressInfoComponent {
  instruction = signal<FormEditInstruction | null>(null);
  addressId = signal<string>('');
  /**
   *
   */
  constructor(
    private addressService: AddressControllerService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router
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

  private generateForm(data: AccountAddressDto) {
    const form = new Reform(AddressForm, data);
    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert('Validation Error', 'Please check the form for errors and try again.', "error");
      },
      beforeSave: (form: Reform) => true,
      saveMethod: (data) => {
        if (data.id) {
          return this.addressService.update(data);
        }
        return this.addressService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert('Success', 'Address information updated successfully.', "success");
        if (this.addressId() === 'new') {
          this.router.navigate(['..', out.id], { relativeTo: this.activatedRoute, replaceUrl: true });
          return;
        }
        this.instruction.update(a => {
          if (a) {
          //   // const form = new Reform(AccountForm);
            form.patchValue(out);
          //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { }
    } as FormEditInstruction<AccountAddressDto, AccountAddressDto>);
  }



}
