import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.componentInstance.ariaLabel = 'Loading';
  });

  it('renders the accessible progress value and fill width', () => {
    fixture.componentInstance.value = 42;
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector(
      '[role="progressbar"]',
    ) as HTMLElement;
    const fill = fixture.nativeElement.querySelector(
      '.progress-fill',
    ) as HTMLElement;

    expect(progress.getAttribute('aria-label')).toBe('Loading');
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('100');
    expect(progress.getAttribute('aria-valuenow')).toBe('42');
    expect(fill.style.width).toBe('42%');
  });

  it.each([
    [-10, 0],
    [120, 100],
    [Number.NaN, 0],
  ])('clamps the input %s to %s', (value, expected) => {
    fixture.componentInstance.value = value;
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector(
      '[role="progressbar"]',
    ) as HTMLElement;
    const fill = fixture.nativeElement.querySelector(
      '.progress-fill',
    ) as HTMLElement;

    expect(progress.getAttribute('aria-valuenow')).toBe(String(expected));
    expect(fill.style.width).toBe(`${expected}%`);
  });
});
