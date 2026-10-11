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

  it('emits after a successful price save but not after a failed save', () => {
    const emit = jest.spyOn(component.pricesChanged, 'emit');
    component.createPrice();
    const instruction = component.instruction();
    if (!instruction) {
      throw new Error('Expected the price editing form');
    }
    const data = instruction.form.value;
    instruction.afterSaveError(new Error('Save failed'), data);
    expect(emit).not.toHaveBeenCalled();
    instruction.afterSaveSuccess(data, data);
    expect(emit).toHaveBeenCalledTimes(1);
  });
});
