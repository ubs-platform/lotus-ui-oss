import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextNumberComponent } from './text-number.component';

describe('TextNumberComponent', () => {
  let component: TextNumberComponent;
  let fixture: ComponentFixture<TextNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
