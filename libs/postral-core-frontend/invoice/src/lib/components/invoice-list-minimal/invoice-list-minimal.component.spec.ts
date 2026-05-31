import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceListMinimalComponent } from './invoice-list-minimal.component';

describe('InvoiceListMinimalComponent', () => {
  let component: InvoiceListMinimalComponent;
  let fixture: ComponentFixture<InvoiceListMinimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceListMinimalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceListMinimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
