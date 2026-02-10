import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarningWatermarkComponent } from './warning-watermark.component';

describe('WarningWatermarkComponent', () => {
  let component: WarningWatermarkComponent;
  let fixture: ComponentFixture<WarningWatermarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningWatermarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WarningWatermarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
