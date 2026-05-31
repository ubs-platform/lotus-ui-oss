import { Component, input, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import {
  ItemAdminControllerService,
  ItemCrudService,
} from '@lotus/postral-core-frontend/client';
import {
  AccountDTO,
  AccountAddressDto,
  ItemPriceDTO,
} from '@tk-postral/payment-common';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import { ItemPriceForm } from '@lotus/postral-core-frontend/forms';

@Component({
  selector: 'lib-item-price-list',
  standalone: false,
  templateUrl: './item-price-list.component.html',
  styleUrls: ['./item-price-list.component.scss'],
})
export class ItemPriceListComponent {
  table = viewChild<SearchableDataTableComponent>('table');
  itemId = input<string>('');
  admin = signal<boolean>(false);
  prices = signal<ItemPriceDTO[]>([]);
  instruction = signal<FormEditInstruction | null>(null);
  selectedPage = signal<string>('list');

  constructor(
    private overlayService: BasicOverlayService,
    private itemService: ItemCrudService
  ) {}

  ngOnInit(): void {
    this.loadPrices();
  }

  loadPrices(): void {
    this.itemService.getDefaultPrices(this.itemId()).subscribe((prices) => {
      this.prices.set(prices);
    });
  }

  createPrice(): void {
    const newPrice: ItemPriceDTO = {
      id: '',
      itemId: this.itemId(),
      variation: 'default',
      itemPrice: 0,
      currency: 'TRY',
      region: 'any',
      activityOrder: 0,
    };

    this.setupForm(newPrice);
    this.selectedPage.set('form');
  }

  editPrice(price: ItemPriceDTO): void {
    this.setupForm(price);
    this.selectedPage.set('form');
  }

  deletePrice(priceId: string): void {
    this.overlayService
      .confirm('Emin misiniz?', 'Bu fiyatı silmek istediğinize emin misiniz?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.performDelete(priceId);
        }
      });
  }

  private performDelete(priceId: string): void {
    this.itemService.removePrice(this.itemId(), priceId).subscribe(() => {
      this.overlayService.alert(
        'Başarılı',
        'Fiyat başarıyla silindi.',
        'success'
      );
      this.loadPrices();
    });
  }

  private setupForm(data: ItemPriceDTO): void {
    const form = new Reform(ItemPriceForm, data);

    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.overlayService.alert(
          'Doğrulama Hatası',
          'Lütfen formu kontrol edip tekrar deneyin.',
          'error'
        );
      },
      beforeSave: (form: Reform) => true,
      saveMethod: (data) => {
        return this.itemService.updateDefaultPrice(data);
      },
      afterSaveSuccess: (out, data) => {
        this.overlayService.alert(
          'Başarılı',
          'Fiyat bilgileri başarıyla güncellendi.',
          'success'
        );
        this.selectedPage.set('list');
        this.loadPrices();
      },
      afterSaveError: (error, data) => {
        this.overlayService.alert('Hata', 'Fiyat kaydedilemedi.', 'error');
      },
    } as FormEditInstruction<ItemPriceForm, ItemPriceForm>);
  }

  backToList(): void {
    this.selectedPage.set('list');
    this.instruction.set(null);
  }
}
