import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ItemCrudService } from '@lotus/postral-core-frontend/client';
import { of } from 'rxjs';
import { ItemPriceEditComponent } from './item-price-edit.component';

describe('ItemPriceEditComponent', () => {
  let fixture: ComponentFixture<ItemPriceEditComponent>;
  let component: ItemPriceEditComponent;
  const service = { updateDefaultPrice: jest.fn() };
  const overlay = { alert: jest.fn() };

  beforeEach(async () => {
    service.updateDefaultPrice.mockReset().mockReturnValue(of({}));
    overlay.alert.mockReset();
    await TestBed.configureTestingModule({
      imports: [ItemPriceEditComponent],
      providers: [
        { provide: ItemCrudService, useValue: service },
        { provide: BasicOverlayService, useValue: overlay },
      ],
    })
      .overrideComponent(ItemPriceEditComponent, { set: { template: '' } })
      .compileComponents();
    fixture = TestBed.createComponent(ItemPriceEditComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemId', 'item-1');
    fixture.detectChanges();
  });

  it('creates a form with the existing default price values', () => {
    expect(component.instruction()?.form.value).toMatchObject({
      id: '',
      itemId: 'item-1',
      variation: 'default',
      currency: 'TRY',
      itemPrice: 0,
      region: 'any',
      activityOrder: 0,
    });
  });

  it('loads the selected price and saves it through the existing endpoint', () => {
    const price = { id: 'price-1', itemId: 'item-1', variation: '6months', itemPrice: 125, currency: 'TRY' };
    fixture.componentRef.setInput('price', price);
    fixture.detectChanges();
    const instruction = component.instruction()!;
    expect(instruction.form.value).toMatchObject(price);
    instruction.saveMethod(instruction.form.value);
    expect(service.updateDefaultPrice).toHaveBeenCalledWith(instruction.form.value);
  });

  it('preserves draft values across change detection and can reset a new form', () => {
    const instruction = component.instruction()!;
    instruction.form.patchValue({ variation: '6months', itemPrice: 125 });
    fixture.detectChanges();
    expect(component.instruction()).toBe(instruction);
    expect(component.instruction()?.form.value.itemPrice).toBe(125);
    component.resetForm();
    expect(component.instruction()?.form.value.itemPrice).toBe(0);
  });

  it('emits saved only for success, preserving a failed draft', () => {
    const emit = jest.spyOn(component.saved, 'emit');
    const instruction = component.instruction()!;
    instruction.form.patchValue({ itemPrice: 125 });
    const data = instruction.form.value;
    instruction.afterSaveError(new Error('Save failed'), data);
    expect(emit).not.toHaveBeenCalled();
    expect(component.instruction()).toBe(instruction);
    expect(component.instruction()?.form.value.itemPrice).toBe(125);
    expect(overlay.alert).toHaveBeenLastCalledWith('general.error', 'postral.item-price.save-error', 'error');
    instruction.afterSaveSuccess(data, data);
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it('cancels editing without saving and resets to a new price', () => {
    fixture.componentRef.setInput('price', {
      id: 'price-1', itemId: 'item-1', variation: '6months', itemPrice: 125, currency: 'TRY',
    });
    fixture.detectChanges();
    const cancelled = jest.spyOn(component.cancelled, 'emit');
    const saved = jest.spyOn(component.saved, 'emit');
    const instruction = component.instruction()!;
    instruction.form.patchValue({ itemPrice: 250 });
    instruction.extraActions![0].action(instruction.form);
    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(saved).not.toHaveBeenCalled();
    expect(service.updateDefaultPrice).not.toHaveBeenCalled();
    expect(component.instruction()?.form.value).toMatchObject({
      id: '', itemId: 'item-1', variation: 'default', itemPrice: 0, currency: 'TRY',
    });
  });

  it('clears an unsaved new-price draft on cancel', () => {
    component.instruction()!.form.patchValue({ variation: '6months', itemPrice: 125 });
    component.cancel();
    fixture.detectChanges();
    expect(component.instruction()?.form.value).toMatchObject({
      id: '', variation: 'default', itemPrice: 0,
    });
    expect(service.updateDefaultPrice).not.toHaveBeenCalled();
  });
});
