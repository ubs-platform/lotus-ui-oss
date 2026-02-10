import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularLoadingIndicatorComponent } from './circular-loading-indicator.component';

describe('CircularLoadingIndicatorComponent', () => {
  let component: CircularLoadingIndicatorComponent;
  let fixture: ComponentFixture<CircularLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularLoadingIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
