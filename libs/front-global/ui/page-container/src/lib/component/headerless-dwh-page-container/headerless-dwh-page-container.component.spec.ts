import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderlessDwhPageContainerComponent } from './headerless-dwh-page-container.component';

describe('HeaderlessDwhPageContainerComponent', () => {
  let component: HeaderlessDwhPageContainerComponent;
  let fixture: ComponentFixture<HeaderlessDwhPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderlessDwhPageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderlessDwhPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
