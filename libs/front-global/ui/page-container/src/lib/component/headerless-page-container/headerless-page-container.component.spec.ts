import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderlessPageContainerComponent } from './headerless-page-container.component';

describe('HeaderlessPageContainerComponent', () => {
  let component: HeaderlessPageContainerComponent;
  let fixture: ComponentFixture<HeaderlessPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderlessPageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderlessPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
