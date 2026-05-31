import {
  ItemDTO,
  PaymentItemInputDto,
  UNIT_TYPES_MAPPED,
} from '@tk-postral/payment-common';
import { Subject } from 'rxjs';

export class OrderManagement {
  _onChange = new Subject<void>();
  previousOrders: Array<PaymentItemInputDto & { _itemName: string }> = [];
  orders: Array<PaymentItemInputDto & { _itemName: string }> = [];
  alreadyReverted = false;
  revertChanges() {
    if (this.alreadyReverted) {
      return;
    }
    this.alreadyReverted = true;
    this.orders = [...this.previousOrders];
    this._onChange.next();
  }

  setOrders(orders: Array<PaymentItemInputDto & { _itemName: string }>) {
    this.orders = orders;
    this.notifyChanges();
  }

  private notifyChanges() {
    this._onChange.next();
    this.alreadyReverted = false;
  }

  addOrder(item: ItemDTO, variation: string) {
    this.previousOrders = [...this.orders];
    const exists = this.orders.find(
      (o) => o.itemId === item.id && o.variation === variation
    );
    if (!exists) {
      this.orders.push({
        itemId: item.id,
        variation,
        quantity: 1,
        unit: item.unit,
        _itemName: item.name,
      });
    } else {
      exists.quantity += 1;
    }
    this.notifyChanges();
  }

  removeOrder(itemId: string, variation: string) {
    this.previousOrders = [...this.orders];

    this.orders = this.orders.filter(
      (o) => !(o.itemId === itemId && o.variation === variation)
    );
    this.notifyChanges();
  }

  plusOneOrder(itemId: string, variation: string) {
    const exists = this.orders.find(
      (o) => o.itemId === itemId && o.variation === variation
    );
    if (!exists) {
      return;
    }
    this.previousOrders = [...this.orders];

    exists.quantity += 1;
    this.notifyChanges();
  }

  subtractOrder(itemId: string, variation: string) {
    const exists = this.orders.find(
      (o) => o.itemId === itemId && o.variation === variation
    );
    if (exists) {
      this.previousOrders = [...this.orders];

      if (exists.quantity > 1) {
        exists.quantity -= 1;
      } else {
        this.removeOrder(itemId, variation);
      }
    }
    this.notifyChanges();
  }

  // getOrders(): PaymentItemInputDto[] {
  //     return this.orders
  // }

  getItemQuantity(itemId: string, variation: string) {
    const exists = this.orders.find(
      (o) => o.itemId === itemId && o.variation === variation
    );
    return (
      (exists ? exists.quantity : 0) +
      ' ' +
      UNIT_TYPES_MAPPED[
        (exists?.unit as keyof typeof UNIT_TYPES_MAPPED) || 'C62'
      ]
    );
  }
}
