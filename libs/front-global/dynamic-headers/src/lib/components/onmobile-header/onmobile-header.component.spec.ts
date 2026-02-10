import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnmobileHeaderComponent } from './onmobile-header.component';

describe('OnmobileHeaderComponent', () => {
  let component: OnmobileHeaderComponent;
  let fixture: ComponentFixture<OnmobileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnmobileHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnmobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
