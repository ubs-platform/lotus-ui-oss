import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatorRepositoryService } from '@lotus/extra/ubs-translator-ngx';
import { of } from 'rxjs';
import { ToggleComponent } from './toggle';

describe('ToggleComponent disabled state', () => {
  let fixture: ComponentFixture<ToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
      providers: [
        {
          provide: TranslatorRepositoryService,
          useValue: { getStringListenChanges: () => of('Toggle label') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
  });

  it.each([false, true])(
    'disables the input and label while preserving checked=%s',
    async (checked) => {
      fixture.componentRef.setInput('value', checked);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector('input');
      const label: HTMLElement = fixture.nativeElement.querySelector('.label');
      const changed = jest.fn();
      fixture.componentInstance.value.subscribe(changed);

      expect(input.disabled).toBe(true);
      expect(input.checked).toBe(checked);
      expect(label.parentElement?.classList.contains('disabled')).toBe(true);

      input.click();
      label.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.value()).toBe(checked);
      expect(changed).not.toHaveBeenCalled();
    }
  );

  it('restores interaction when re-enabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const label: HTMLElement = fixture.nativeElement.querySelector('.label');

    expect(input.disabled).toBe(false);
    expect(label.parentElement?.classList.contains('disabled')).toBe(false);

    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(true);

    label.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(false);
  });
});
