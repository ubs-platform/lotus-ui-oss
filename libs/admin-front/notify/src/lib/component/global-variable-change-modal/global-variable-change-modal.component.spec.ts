import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalVariableChangeModalComponent } from './global-variable-change-modal.component';

describe('GlobalVariableChangeModalComponent', () => {
  let component: GlobalVariableChangeModalComponent;
  let fixture: ComponentFixture<GlobalVariableChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalVariableChangeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalVariableChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
