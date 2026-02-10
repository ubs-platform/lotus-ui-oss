import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailChangeStepTwoComponent } from './email-change-step-two.component';

describe('EmailChangeStepTwoComponent', () => {
  let component: EmailChangeStepTwoComponent;
  let fixture: ComponentFixture<EmailChangeStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailChangeStepTwoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailChangeStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
