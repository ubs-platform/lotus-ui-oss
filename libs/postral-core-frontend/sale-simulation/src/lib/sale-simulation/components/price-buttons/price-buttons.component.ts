import { Component, model, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCrudService } from '@lotus/postral-core-frontend/client';
import { ItemPriceDTO } from '@tk-postral/payment-common';

@Component({
  selector: 'price-buttons',
  standalone: false,
  templateUrl: './price-buttons.component.html',
  styleUrls: ['./price-buttons.component.scss'],
})
export class PriceButtonsComponent implements OnInit {

  itemId = model<string | null>(null);
  prices = model<Array<ItemPriceDTO>>([]);
  selectedPrice = output<ItemPriceDTO>();

  constructor(private itemService: ItemCrudService) { }

  ngOnInit(): void {
    this.fetchLatestPrices();
  }

  onPriceSelected(price: ItemPriceDTO) {
    this.selectedPrice.emit(price);
  }
  
  private fetchLatestPrices() {
    if (!this.itemId()) {
      return;
    }
    this.itemService.getLatestPrices(this.itemId()!).subscribe((prices) => {
      console.log('postral.latest-prices', prices);
      this.prices.set(prices);
    });
  }
}
