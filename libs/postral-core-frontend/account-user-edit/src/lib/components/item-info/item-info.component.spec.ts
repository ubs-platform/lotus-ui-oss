import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatorRepositoryService } from '@lotus/extra/ubs-translator-ngx';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { TabViewComponent } from '@lotus/front-global/tab-view';
import { ItemCrudService } from '@lotus/postral-core-frontend/client';
import { of } from 'rxjs';
import { ItemPriceEditComponent } from '../item-price-edit/item-price-edit.component';
import { ItemPriceListComponent } from '../item-price-list/item-price-list.component';
import { ItemInfoComponent } from './item-info.component';

describe('ItemInfoComponent price tabs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemInfoComponent, ItemPriceListComponent],
      imports: [TabViewComponent, ItemPriceEditComponent],
      providers: [
        { provide: ItemCrudService, useValue: { getDefaultPrices: jest.fn().mockReturnValue(of([])) } },
        { provide: BasicOverlayService, useValue: { alert: jest.fn() } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: TranslatorRepositoryService, useValue: {} },
      ],
    })
      .overrideComponent(ItemInfoComponent, { set: { template: '' } })
      .overrideComponent(ItemPriceListComponent, { set: { template: '' } })
      .overrideComponent(ItemPriceEditComponent, { set: { template: '' } })
      .overrideComponent(TabViewComponent, { set: { template: '' } })
      .compileComponents();
  });

  it('opens the separate editor tab for a selected price', () => {
    const component = TestBed.createComponent(ItemInfoComponent).componentInstance;
    const tabs = TestBed.createComponent(TabViewComponent).componentInstance;
    jest.spyOn(component, 'tabs').mockReturnValue(tabs);
    const select = jest.spyOn(tabs, 'select');
    const price = { id: 'price-1', itemId: 'item-1', variation: 'default', itemPrice: 125, currency: 'TRY' };
    component.editPrice(price);
    expect(component.editingPrice()).toBe(price);
    expect(select).toHaveBeenCalledWith('price-form');
  });

  it('returns to the price list on cancel without refreshing or saving', () => {
    const component = TestBed.createComponent(ItemInfoComponent).componentInstance;
    const tabs = TestBed.createComponent(TabViewComponent).componentInstance;
    const list = TestBed.createComponent(ItemPriceListComponent).componentInstance;
    jest.spyOn(component, 'tabs').mockReturnValue(tabs);
    jest.spyOn(component, 'priceList').mockReturnValue(list);
    const select = jest.spyOn(tabs, 'select');
    const refresh = jest.spyOn(list, 'loadPrices');
    component.editingPrice.set({
      id: 'price-1', itemId: 'item-1', variation: 'default', itemPrice: 125, currency: 'TRY',
    });
    component.onPriceCancelled();
    expect(component.editingPrice()).toBeNull();
    expect(select).toHaveBeenCalledWith('pricing');
    expect(refresh).not.toHaveBeenCalled();
  });

  it('refreshes prices and resets a new-price draft after saving', () => {
    const component = TestBed.createComponent(ItemInfoComponent).componentInstance;
    const tabs = TestBed.createComponent(TabViewComponent).componentInstance;
    const list = TestBed.createComponent(ItemPriceListComponent).componentInstance;
    const editorFixture = TestBed.createComponent(ItemPriceEditComponent);
    editorFixture.componentRef.setInput('itemId', 'item-1');
    editorFixture.detectChanges();
    const editor = editorFixture.componentInstance;
    editor.instruction()?.form.patchValue({ itemPrice: 125 });
    jest.spyOn(component, 'tabs').mockReturnValue(tabs);
    jest.spyOn(component, 'priceList').mockReturnValue(list);
    jest.spyOn(component, 'priceEditor').mockReturnValue(editor);
    const select = jest.spyOn(tabs, 'select');
    const refresh = jest.spyOn(list, 'loadPrices');
    component.onPriceSaved();
    expect(component.editingPrice()).toBeNull();
    expect(editor.instruction()?.form.value.itemPrice).toBe(0);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith('pricing');
  });
});
