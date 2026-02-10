import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugKeyValueViewComponent } from './debug-key-value-view.component';

describe('DebugKeyValueViewComponent', () => {
  let component: DebugKeyValueViewComponent;
  let fixture: ComponentFixture<DebugKeyValueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugKeyValueViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebugKeyValueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
