import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReformNgxPrimeComponent } from './reform-ngx-prime.component';

describe('ReformNgxPrimeComponent', () => {
  let component: ReformNgxPrimeComponent;
  let fixture: ComponentFixture<ReformNgxPrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReformNgxPrimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReformNgxPrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
