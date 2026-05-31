import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleSimulationWrapComponent } from './sale-simulation-wrap.component';

describe('SaleSimulationWrapComponent', () => {
  let component: SaleSimulationWrapComponent;
  let fixture: ComponentFixture<SaleSimulationWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleSimulationWrapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleSimulationWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
