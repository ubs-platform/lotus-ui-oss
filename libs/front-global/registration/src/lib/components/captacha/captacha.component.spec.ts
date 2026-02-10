import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptachaComponent } from './captacha.component';

describe('CaptachaComponent', () => {
  let component: CaptachaComponent;
  let fixture: ComponentFixture<CaptachaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptachaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaptachaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
