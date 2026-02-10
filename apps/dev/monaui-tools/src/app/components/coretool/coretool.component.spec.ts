import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoretoolComponent } from './coretool.component';

describe('CoretoolComponent', () => {
  let component: CoretoolComponent;
  let fixture: ComponentFixture<CoretoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoretoolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoretoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
