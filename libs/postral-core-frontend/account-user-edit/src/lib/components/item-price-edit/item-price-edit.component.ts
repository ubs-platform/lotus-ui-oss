import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FormEditInstruction, ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { ItemCrudService } from '@lotus/postral-core-frontend/client';
import { ItemPriceForm } from '@lotus/postral-core-frontend/forms';
import { ItemPriceDTO } from '@tk-postral/payment-common';

@Component({
  selector: 'lib-item-price-edit',
  imports: [ReformDataEditComponent],
  template: `
    @if (instruction(); as formInstruction) {
      <lib-reform-data-edit
        [formInstruction]="formInstruction"
        saveButtonPosition="bottom"
      ></lib-reform-data-edit>
    }
  `,
  styleUrl: './item-price-edit.component.scss',
})
export class ItemPriceEditComponent {
  readonly isDefaultPricing = input<boolean>(true);
  readonly itemId = input.required<string>();
  readonly price = input<ItemPriceDTO | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();
  readonly instruction = signal<FormEditInstruction<ItemPriceForm, ItemPriceDTO> | null>(null);
  private readonly overlay = inject(BasicOverlayService);
  private readonly itemService = inject(ItemCrudService);

  constructor() {
    effect(() => this.resetForm());
  }

  cancel(): void {
    this.resetForm(null);
    this.cancelled.emit();
  }

  resetForm(price: ItemPriceDTO | null = this.price()): void {
    const data = price ?? {
      id: '',
      itemId: this.itemId(),
      variation: 'default',
      itemPrice: 0,
      currency: 'TRY',
      region: 'any',
      activityOrder: 0,
    };
    const form = new Reform(ItemPriceForm, data); 
    if (this.isDefaultPricing()) {
      form.setDisableByPath("activityOrder",true);
    }
    this.instruction.set({
      form,
      extraActions: [{
        stringContent: 'general.cancel',
        iconClass: 'material-symbols-outlined',
        iconContent: 'close',
        buttonClass: 'surface',
        action: () => this.cancel(),
      }],
      onValidationError: () => {
        this.overlay.alert('general.validation-error', 'general.validation-error-desc', 'error');
      },
      saveMethod: (value) => this.itemService.updateDefaultPrice(value),
      afterSaveSuccess: () => {
        this.overlay.alert('general.success', 'postral.item-price.saved-success', 'success');
        this.saved.emit();
      },
      afterSaveError: () => {
        this.overlay.alert('general.error', 'postral.item-price.save-error', 'error');
      },
    });
  }
}
