import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountControllerService,
  AccountUserControllerService,
  AddressControllerService,
  ItemCrudService,
  ItemTaxControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  AccountForm,
  AddressForm,
  ItemForm,
} from '@lotus/postral-core-frontend/forms';
import {
  AccountDTO,
  AccountAddressDto,
  UNIT_TYPES_MAPPED,
  ItemDTO,
} from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { lastValueFrom, map } from 'rxjs';
@Component({
  selector: 'lib-account-user-info',
  standalone: false,
  templateUrl: './item-info.component.html',
  styleUrl: './item-info.component.scss',
})
export class ItemInfoComponent {
  instruction = signal<FormEditInstruction | null>(null);
  selectedPage = signal<string>('information');
  itemId = signal<string>('');
  unitDescription = signal<string>('');
  /**
   *
   */
  constructor(
    private itemService: ItemCrudService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const itemId = params['id'];
      if (itemId === 'new') {
        this.itemId.set(itemId);
        this.generateForm({} as ItemDTO);
        return;
      }
      this.itemService.get(itemId).subscribe((data) => {
        this.itemId.set(data.id || '');
        this.generateForm(data);
      });
    });
  }

  private generateForm(data: ItemDTO) {
    const form = new Reform(ItemForm, data);
    this.setUnitDescription(data);

    form.valueUpdate.subscribe((value) => {
      this.setUnitDescription(value);
    });
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
          return this.itemService.update(data);
        }
        return this.itemService.create(data).pipe(map((res) => res));
      },
      
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert(
          'Success',
          'Item information updated successfully.',
          'success'
        );
        if (this.itemId() === "new") {
          this.router.navigate(["..", out.id], { relativeTo: this.activatedRoute, replaceUrl: true });
          return;
        }
        this.instruction.update((a) => {
          if (a) {
            //   // const form = new Reform(ItemForm);
            form.patchValue(out);
            //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { 
        this.basicOverlay.alert(
          'Hata',
          'Öğe bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin. ' + (error?.message || ''),
          'error'
        );
      },
    } as FormEditInstruction<ItemForm, ItemForm>);
  }

  private setUnitDescription(data: ItemDTO | null | undefined) {
    if (!data) {
      return;
    }
    if (!data.unit) {
      this.unitDescription.set('');
      return;
    }
    const desc = UNIT_TYPES_MAPPED[data.unit as keyof typeof UNIT_TYPES_MAPPED]
    if (!desc) {
      this.unitDescription.set(data.unit + " birimi bulunamadı. Fatura oluşturulurken sorun yaşamamak için birim bilgisini kontrol ediniz.");
      return;
    }
    this.unitDescription.set(
      data.unit +
        ' birimi ' +
        desc + ' olarak tanımlanmıştır. Fatura oluşturulurken bu birim kullanılacaktır.'
    );
  }
}
