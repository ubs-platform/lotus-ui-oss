import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailChangeStepOneComponent } from './email-change-step-one.component';

describe('EmailChangeStepOneComponent', () => {
  let component: EmailChangeStepOneComponent;
  let fixture: ComponentFixture<EmailChangeStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailChangeStepOneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailChangeStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
