import { Component, computed, signal, viewChild } from '@angular/core';
import {
  ItemCrudService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  ItemForm,
  UNIT_TYPE_CODES,
} from '@lotus/postral-core-frontend/forms';
import { ItemDTO, ItemPriceDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { TranslatorText } from '@lotus/extra/translator-core';
import { TranslatorRepositoryService } from '@lotus/extra/ubs-translator-ngx';
import { map } from 'rxjs';
import { TabViewComponent } from '@lotus/front-global/tab-view';
import { ItemPriceListComponent } from '../item-price-list/item-price-list.component';
import { ItemPriceEditComponent } from '../item-price-edit/item-price-edit.component';
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
  readonly editingPrice = signal<ItemPriceDTO | null>(null);
  readonly tabs = viewChild<TabViewComponent>('tabs');
  readonly priceList = viewChild(ItemPriceListComponent);
  readonly priceEditor = viewChild(ItemPriceEditComponent);
  private currentData?: ItemDTO | null;
  /**
   *
   */
  constructor(
    private itemService: ItemCrudService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router,
    private translator: TranslatorRepositoryService
  ) { }

  ngOnInit(): void {
    this.translator.changeDetection().subscribe(() => {
      this.setUnitDescription(this.currentData);
    });
    this.activatedRoute.params.subscribe((params) => {
      this.editingPrice.set(null);
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

  editPrice(price: ItemPriceDTO): void {
    this.editingPrice.set(price);
    this.tabs()?.select('price-form');
  }

  onPriceSaved(): void {
    this.editingPrice.set(null);
    this.priceEditor()?.resetForm();
    this.priceList()?.loadPrices();
    this.tabs()?.select('pricing');
  }

  onPriceCancelled(): void {
    this.editingPrice.set(null);
    this.tabs()?.select('pricing');
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
          'general.validation-error',
          'general.validation-error-desc',
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
          'general.success',
          'postral.item.updated-success',
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
          'general.error',
          'postral.item.error-while-save',
          'error'
        );
      },
    } as FormEditInstruction<ItemForm, ItemForm>);
  }

  private setUnitDescription(data: ItemDTO | null | undefined) {
    this.currentData = data;
    const form = this.instruction()?.form;
    form?.setInfoByPath('unit', undefined);
    form?.setWarningByPath('unit', undefined);
    if (!data) {
      return;
    }
    if (!data.unit) {
      return;
    }
    const isValidUnit = (UNIT_TYPE_CODES as readonly string[]).includes(data.unit);
    if (!isValidUnit) {
      form?.setWarningByPath('unit',
        {
          key: 'postral.item.unit-not-found',
          parameters: { unit: data.unit },
        }
      )
      return;
    }
    const desc = this.translator.getString(`postral.units.${data.unit}`);
    form?.setInfoByPath('unit',
      {
        key: 'postral.item.unit-defined',
        parameters: {
          unit: data.unit,
          desc: desc,
        },
      }
    )
  }
}
