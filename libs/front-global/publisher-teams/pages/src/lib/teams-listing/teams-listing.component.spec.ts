import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamsListingComponent } from './teams-listing.component';

describe('TeamsListingComponent', () => {
  let component: TeamsListingComponent;
  let fixture: ComponentFixture<TeamsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamsListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
