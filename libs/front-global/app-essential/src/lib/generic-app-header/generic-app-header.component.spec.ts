import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericAppHeaderComponent } from './generic-app-header.component';

describe('GenericAppHeaderComponent', () => {
  let component: GenericAppHeaderComponent;
  let fixture: ComponentFixture<GenericAppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericAppHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
