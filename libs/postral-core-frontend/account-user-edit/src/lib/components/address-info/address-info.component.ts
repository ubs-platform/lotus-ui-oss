import { Component, signal } from '@angular/core';
import { AddressControllerService } from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { AddressDtoWithUserInput, AddressForm } from '@lotus/postral-core-frontend/forms';
import { AccountAddressDto } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CscdClientService } from 'libs/front-global/cscd-client/src/lib/cscd-client.service';
import { from, lastValueFrom, switchMap } from 'rxjs';
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
    private cscdService: CscdClientService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router
  ) { }

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

  async setUserInputFieldsToRelatedFields(reform: Reform) {
    const data = reform.value as AddressDtoWithUserInput;
    const country = data.countryCodeUserInput;
    const countryName = (await lastValueFrom(this.cscdService.getCountries())).find(a => a.code == country)?.name;

    const countryHasSubdivisions = await lastValueFrom(this.cscdService.hasSubdivisions(country || ''));
    const subdivisions = await lastValueFrom(this.cscdService.getSubdivisions(country || ''));
    const subdivision = subdivisions.find((item) =>
      item.code === data.subdivisionUserInput ||
      item._id === data.subdivisionUserInput ||
      item.name === data.subdivisionUserInput
    );
    const subdivisionCode = subdivision?.code || data.subdivisionUserInput;
    const subdivisionName = subdivision?.name || data.subdivisionUserInput;
    const localities = await lastValueFrom(
      this.cscdService.getLocalities(country || '', subdivisionCode || '')
    );
    const locality = localities.find((item) =>
      item.code === data.localityUserInput ||
      item._id === data.localityUserInput ||
      item.name === data.localityUserInput
    );
    const localityName = locality?.name || data.localityUserInput;
    reform.setValueByPath('country', country);
    reform.setValueByPath('countryReadName', countryName)
    if (countryHasSubdivisions) {
      reform.setValueByPath('countrySubentityCode', subdivisionCode);
      reform.setValueByPath('countrySubentity', subdivisionName);
      reform.setValueByPath('cityName', localityName);
      reform.setValueByPath('cityCode', locality?.code || data.localityUserInput);
      // data.countrySubentityCode = subdivisionCode;
      // data.countrySubentity = subdivisionName;
      // data.cityName = localityName;
      // data.cityCode = locality?.code || data.localityUserInput;
    } else {
      // Örn: Türkiye'de eyalet yok, bu yüzden subdivisionUserInput alanı cityCode olarak kullanılacak. localityUserInput ise citySubdivisionName olarak kullanılacak.
      reform.setValueByPath('cityCode', subdivisionCode);
      reform.setValueByPath('cityName', subdivisionName);
      reform.setValueByPath('citySubdivisionName', localityName);
      reform.setValueByPath('countrySubentityCode', '');
      reform.setValueByPath('countrySubentity', '');
      // data.cityCode = subdivisionCode;
      // data.cityName = subdivisionName;
      // data.citySubdivisionName = localityName;
      // data.countrySubentityCode = '';
      // data.countrySubentity = '';
    }
  }

  async populateDataWithUserInputs(data: AccountAddressDto) {
    let dataAsUserInput: AddressDtoWithUserInput = data as AddressDtoWithUserInput;
    dataAsUserInput.countryCodeUserInput = data.country;
    const countryHasSubdivisions = await lastValueFrom(this.cscdService.hasSubdivisions(data.country));
    if (countryHasSubdivisions) {
      dataAsUserInput.subdivisionUserInput = data.countrySubentityCode!;
      dataAsUserInput.localityUserInput = data.cityCode!;
    } else {
      dataAsUserInput.subdivisionUserInput = data.cityCode!;
      dataAsUserInput.localityUserInput = data.citySubdivisionName;
    }
  }

  private generateForm(data: AccountAddressDto) {
    this.populateDataWithUserInputs(data).then(() => {
      this.generateFormWithUserInput(data as AddressDtoWithUserInput);
    });
  }

  private generateFormWithUserInput(data: AddressDtoWithUserInput) {
    const form = new Reform<Partial<AddressDtoWithUserInput>>(AddressForm, data);

    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert('Validation Error', 'Please check the form for errors and try again.', "error");
      },
      beforeValidation: async (form: Reform) => {
        await this.setUserInputFieldsToRelatedFields(form)
      },
      saveMethod: (data) => {
        if (data.id) {
          return this.addressService.update(data);
        }
        return this.addressService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert('general.success', 'postral.address.saved', "success");
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
