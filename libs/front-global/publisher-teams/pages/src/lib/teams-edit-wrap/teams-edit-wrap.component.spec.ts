import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamsEditWrapComponent } from './teams-edit-wrap.component';

describe('TeamsEditWrapComponent', () => {
  let component: TeamsEditWrapComponent;
  let fixture: ComponentFixture<TeamsEditWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamsEditWrapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsEditWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
