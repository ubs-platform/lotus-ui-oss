import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackbarComponent } from './trackbar.component';

describe('TrackbarComponent', () => {
  let component: TrackbarComponent;
  let fixture: ComponentFixture<TrackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    [0, 100, 0, '0%'],
    [0, 100, 50, '50%'],
    [0, 100, 100, '100%'],
    [20, 60, 30, '25%'],
    [-100, 100, 0, '50%'],
    [20, 60, 0, '0%'],
    [20, 60, 80, '100%'],
    [20, 20, 20, '0%'],
    [60, 20, 40, '0%'],
  ])(
    'should fill the track for min=%s, max=%s, value=%s',
    async (min, max, value, fill) => {
      fixture.componentRef.setInput('minValue', min);
      fixture.componentRef.setInput('maxValue', max);
      fixture.componentRef.setInput('value', value);
      fixture.detectChanges();
      await fixture.whenStable();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector('input');
      expect(input.style.getPropertyValue('--trackbar-fill')).toBe(fill);
    },
  );

  it('should update the model and fill when the slider moves', async () => {
    fixture.componentRef.setInput('step', 5);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = '35';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.value()).toBe(35);
    expect(input.step).toBe('5');
    expect(input.style.getPropertyValue('--trackbar-fill')).toBe('35%');
  });
});
