import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import type { ReportDTO } from '@tk-postral/payment-common';
import { ReportSummaryRotatorComponent } from './report-summary-rotator.component';

@Component({
  selector: 'lib-money-display',
  standalone: true,
  template: '',
})
class MoneyDisplayStubComponent {
  @Input() amount: number | null | undefined = null;
  @Input() currency: string | null | undefined = null;
}

describe('ReportSummaryRotatorComponent', () => {
  let fixture: ComponentFixture<ReportSummaryRotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryRotatorComponent, MoneyDisplayStubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSummaryRotatorComponent);
  });

  it('rotates through reports and wraps back to the first report', fakeAsync(() => {
    fixture.componentRef.setInput('reports', [
      createReport('First account'),
      createReport('Second account'),
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('First account');

    tick(5000);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Second account');

    tick(5000);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('First account');
  }));

  it('keeps a single report visible without rotating', fakeAsync(() => {
    fixture.componentRef.setInput('reports', [createReport('Only account')]);
    fixture.detectChanges();

    tick(10000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Only account');
  }));

  it('starts from the first report when the report list changes', fakeAsync(() => {
    fixture.componentRef.setInput('reports', [
      createReport('First account'),
      createReport('Second account'),
    ]);
    fixture.detectChanges();

    tick(5000);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Second account');

    fixture.componentRef.setInput('reports', [
      createReport('Updated first account'),
      createReport('Updated second account'),
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Updated first account');
  }));
});

function createReport(accountName: string): ReportDTO {
  return {
    id: accountName,
    queryId: 'query',
    periodLabel: 'today',
    currency: 'TRY',
    paymentCount: 0,
    totalSaleAmount: 0,
    totalRefundAmount: 0,
    totalSaleTaxAmount: 0,
    totalRefundTaxAmount: 0,
    netTaxAmount: 0,
    netSaleAmount: 0,
    netRevenue: 0,
    totalExpenseAmount: 0,
    totalSaleAmountWithoutExpense: 0,
    reportType: 'SELLER',
    totalExpense: 0,
    netRevenueWithoutExpense: 0,
    netRevenueWithoutExpenseTaxed: 0,
    accountName,
  };
}
