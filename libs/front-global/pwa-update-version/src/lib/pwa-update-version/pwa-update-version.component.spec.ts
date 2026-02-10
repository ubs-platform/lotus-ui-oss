import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PwaUpdateVersionComponent } from './pwa-update-version.component';

describe('PwaUpdateVersionComponent', () => {
  let component: PwaUpdateVersionComponent;
  let fixture: ComponentFixture<PwaUpdateVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaUpdateVersionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaUpdateVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
