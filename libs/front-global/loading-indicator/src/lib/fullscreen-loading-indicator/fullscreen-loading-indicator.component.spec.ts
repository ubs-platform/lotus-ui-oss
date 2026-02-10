import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullscreenLoadingIndicatorComponent } from './fullscreen-loading-indicator.component';

describe('FullscreenLoadingIndicatorComponent', () => {
  let component: FullscreenLoadingIndicatorComponent;
  let fixture: ComponentFixture<FullscreenLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullscreenLoadingIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullscreenLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
