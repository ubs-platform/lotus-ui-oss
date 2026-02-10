import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexyPageContainerComponent } from './flexy-page-container.component';

describe('FlexyPageContainerComponent', () => {
  let component: FlexyPageContainerComponent;
  let fixture: ComponentFixture<FlexyPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlexyPageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlexyPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
