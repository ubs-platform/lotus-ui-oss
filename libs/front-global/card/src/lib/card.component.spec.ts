import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
    fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('title', 'Deneme');
    fixture.componentRef.setInput('imageUrl', '/a.png');
    fixture.componentRef.setInput('badge', 'Etiket');
    fixture.detectChanges();
  });

  it('renders title and badge', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Deneme');
    expect(text).toContain('Etiket');
  });

  it('emits selected on click', () => {
    let count = 0;
    fixture.componentInstance.selected.subscribe(() => count++);
    (fixture.nativeElement.querySelector('.card') as HTMLElement).click();
    expect(count).toBe(1);
  });

  it('falls back to the not-found image after an error', () => {
    fixture.componentInstance.markFailed();
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/assets/not-found.image.png');
  });
});
