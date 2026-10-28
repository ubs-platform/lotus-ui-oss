import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ItemCrudService } from '@lotus/postral-core-frontend/client';
import { of, Subject } from 'rxjs';
import { ItemPriceListComponent } from './item-price-list.component';

describe('ItemPriceListComponent price changes', () => {
  let fixture: ComponentFixture<ItemPriceListComponent>;
  let component: ItemPriceListComponent;
  const itemService = { getDefaultPrices: jest.fn(), removePrice: jest.fn() };
  const overlay = { alert: jest.fn(), confirm: jest.fn() };

  beforeEach(async () => {
    itemService.getDefaultPrices.mockReset().mockReturnValue(of([]));
    itemService.removePrice.mockReset().mockReturnValue(of({}));
    overlay.confirm.mockReset().mockReturnValue(of(true));
    overlay.alert.mockReset();
    await TestBed.configureTestingModule({
      declarations: [ItemPriceListComponent],
      providers: [
        { provide: ItemCrudService, useValue: itemService },
        { provide: BasicOverlayService, useValue: overlay },
      ],
    })
      .overrideComponent(ItemPriceListComponent, { set: { template: '' } })
      .compileComponents();
    fixture = TestBed.createComponent(ItemPriceListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemId', 'item-1');
    fixture.detectChanges();
  });

  it('does not emit a mutation event for a normal refresh', () => {
    const emit = jest.spyOn(component.pricesChanged, 'emit');
    component.loadPrices();
    expect(emit).not.toHaveBeenCalled();
  });

  it('opens a new price from the form navigation action', () => {
    component.openPriceForm();
    expect(component.selectedPage()).toBe('form');
    expect(component.editingPrice()).toBeNull();
  });

  it('preserves the current editor when its navigation action is clicked again', () => {
    const price = { id: 'price-1', itemId: 'item-1', variation: '6months', itemPrice: 125, currency: 'TRY' };
    component.editPrice(price);
    component.openPriceForm();
    expect(component.editingPrice()).toBe(price);
    expect(component.selectedPage()).toBe('form');
  });

  it('clears the editor on returning to the list', () => {
    component.openPriceForm();
    component.backToList();
    expect(component.selectedPage()).toBe('list');
    expect(component.editingPrice()).toBeNull();
  });

  it('delegates edits without opening an embedded form in external-editor mode', () => {
    fixture.componentRef.setInput('externalEditor', true);
    const emit = jest.spyOn(component.editRequested, 'emit');
    const price = { id: 'price-1', itemId: 'item-1', variation: 'default', itemPrice: 125, currency: 'TRY' };
    component.editPrice(price);
    expect(emit).toHaveBeenCalledWith(price);
    expect(component.selectedPage()).toBe('list');
    expect(component.editingPrice()).toBeNull();
  });

  it('emits only after a price is successfully deleted', () => {
    const emit = jest.spyOn(component.pricesChanged, 'emit');
    const deleted = new Subject<object>();
    itemService.removePrice.mockReturnValue(deleted);
    component.deletePrice('price-1');
    expect(emit).not.toHaveBeenCalled();
    expect(itemService.removePrice).toHaveBeenCalledWith('item-1', 'price-1');
    deleted.next({});
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it('does not emit when deletion is cancelled', () => {
    const emit = jest.spyOn(component.pricesChanged, 'emit');
    overlay.confirm.mockReturnValue(of(false));
    component.deletePrice('price-1');
    expect(itemService.removePrice).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('refreshes and emits when the embedded editor reports a successful save', () => {
    const emit = jest.spyOn(component.pricesChanged, 'emit');
    component.createPrice();
    expect(emit).not.toHaveBeenCalled();
    const loads = itemService.getDefaultPrices.mock.calls.length;
    component.onPriceSaved();
    expect(emit).toHaveBeenCalledTimes(1);
    expect(itemService.getDefaultPrices).toHaveBeenCalledTimes(loads + 1);
    expect(component.selectedPage()).toBe('list');
    expect(component.editingPrice()).toBeNull();
  });
});
