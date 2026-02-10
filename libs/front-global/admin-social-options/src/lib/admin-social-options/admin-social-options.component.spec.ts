import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSocialOptionsComponent } from './admin-social-options.component';

describe('AdminSocialOptionsComponent', () => {
  let component: AdminSocialOptionsComponent;
  let fixture: ComponentFixture<AdminSocialOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSocialOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSocialOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
