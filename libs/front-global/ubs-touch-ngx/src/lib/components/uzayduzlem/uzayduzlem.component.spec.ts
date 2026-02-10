import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UzayduzlemComponent } from './uzayduzlem.component';

describe('UzayduzlemComponent', () => {
  let component: UzayduzlemComponent;
  let fixture: ComponentFixture<UzayduzlemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UzayduzlemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UzayduzlemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
