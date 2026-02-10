import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReformDataEditComponent } from './reform-data-edit.component';

describe('ReformDataEditComponent', () => {
  let component: ReformDataEditComponent;
  let fixture: ComponentFixture<ReformDataEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReformDataEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReformDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
