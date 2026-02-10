import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationCompletionComponent } from './registration-completion.component';

describe('RegistrationCompletionComponent', () => {
  let component: RegistrationCompletionComponent;
  let fixture: ComponentFixture<RegistrationCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationCompletionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
