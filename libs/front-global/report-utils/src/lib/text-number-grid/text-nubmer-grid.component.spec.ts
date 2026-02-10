import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextNubmerGridComponent } from './text-nubmer-grid.component';

describe('TextNubmerGridComponent', () => {
  let component: TextNubmerGridComponent;
  let fixture: ComponentFixture<TextNubmerGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextNubmerGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextNubmerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
