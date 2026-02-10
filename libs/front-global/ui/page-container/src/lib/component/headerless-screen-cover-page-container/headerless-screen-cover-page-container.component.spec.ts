import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderlessScreenCoverPageContainerComponent } from './headerless-screen-cover-page-container.component';

describe('HeaderlessScreenCoverPageContainerComponent', () => {
  let component: HeaderlessScreenCoverPageContainerComponent;
  let fixture: ComponentFixture<HeaderlessScreenCoverPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderlessScreenCoverPageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      HeaderlessScreenCoverPageContainerComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
