import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinkyReformComponent } from './minky-reform.component';

describe('MinkyReformComponent', () => {
  let component: MinkyReformComponent;
  let fixture: ComponentFixture<MinkyReformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinkyReformComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MinkyReformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
