import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamSelectionDialogComponent } from './team-selection-dialog.component';

describe('TeamSelectionDialogComponent', () => {
  let component: TeamSelectionDialogComponent;
  let fixture: ComponentFixture<TeamSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSelectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamSelectionDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
