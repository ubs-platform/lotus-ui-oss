import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockPartBaseButtonComponent } from './block-part-base-button.component';

describe('BlockPartBaseButtonComponent', () => {
  let component: BlockPartBaseButtonComponent;
  let fixture: ComponentFixture<BlockPartBaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockPartBaseButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockPartBaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
