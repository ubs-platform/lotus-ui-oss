import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockPartBaseComponent } from './block-part-base.component';

describe('BlockPartBaseComponent', () => {
  let component: BlockPartBaseComponent;
  let fixture: ComponentFixture<BlockPartBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockPartBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockPartBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
