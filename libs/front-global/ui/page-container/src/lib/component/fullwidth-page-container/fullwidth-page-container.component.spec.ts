import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullwidthPageContainerComponent } from './fullwidth-page-container.component';

describe('FullwidthPageContainerComponent', () => {
  let component: FullwidthPageContainerComponent;
  let fixture: ComponentFixture<FullwidthPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullwidthPageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullwidthPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
