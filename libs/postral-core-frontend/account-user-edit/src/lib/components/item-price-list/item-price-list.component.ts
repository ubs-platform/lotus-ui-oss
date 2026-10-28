import { Component, input, output, signal, viewChild } from '@angular/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import {
  ItemCrudService,
} from '@lotus/postral-core-frontend/client';
import {
  ItemPriceDTO,
} from '@tk-postral/payment-common';

@Component({
  selector: 'lib-item-price-list',
  standalone: false,
  templateUrl: './item-price-list.component.html',
  styleUrls: ['./item-price-list.component.scss'],
})
export class ItemPriceListComponent {
  table = viewChild<SearchableDataTableComponent>('table');
  itemId = input<string>('');
  readonly pricesChanged = output<void>();
  readonly externalEditor = input(false);
  readonly editRequested = output<ItemPriceDTO>();
  admin = signal<boolean>(false);
  prices = signal<ItemPriceDTO[]>([]);
  readonly editingPrice = signal<ItemPriceDTO | null>(null);
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
    this.editingPrice.set(null);
    this.selectedPage.set('form');
  }

  openPriceForm(): void {
    if (this.selectedPage() === 'form') {
      this.selectedPage.set('form');
      return;
    }
    this.createPrice();
  }

  editPrice(price: ItemPriceDTO): void {
    if (this.externalEditor()) {
      this.editRequested.emit(price);
      return;
    }
    this.editingPrice.set(price);
    this.selectedPage.set('form');
  }

  deletePrice(priceId: string): void {
    this.overlayService
      .confirm('general.confirm-title', 'postral.item-price.delete-confirm-message')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.performDelete(priceId);
        }
      });
  }

  private performDelete(priceId: string): void {
    this.itemService.removePrice(this.itemId(), priceId).subscribe(() => {
      this.overlayService.alert(
        'general.success',
        'postral.item-price.deleted-success',
        'success'
      );
      this.loadPrices();
      this.pricesChanged.emit();
    });
  }

  onPriceSaved(): void {
    this.backToList();
    this.loadPrices();
    this.pricesChanged.emit();
  }

  backToList(): void {
    this.selectedPage.set('list');
    this.editingPrice.set(null);
  }
}
