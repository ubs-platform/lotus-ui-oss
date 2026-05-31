import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFrameComponent } from './admin-frame.component';

describe('AdminFrameComponent', () => {
  let component: AdminFrameComponent;
  let fixture: ComponentFixture<AdminFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFrameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
