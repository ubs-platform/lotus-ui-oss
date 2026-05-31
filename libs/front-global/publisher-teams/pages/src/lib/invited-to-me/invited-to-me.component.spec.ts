import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitedToMeComponent } from './invited-to-me.component';

describe('InvitedToMeComponent', () => {
  let component: InvitedToMeComponent;
  let fixture: ComponentFixture<InvitedToMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitedToMeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitedToMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
