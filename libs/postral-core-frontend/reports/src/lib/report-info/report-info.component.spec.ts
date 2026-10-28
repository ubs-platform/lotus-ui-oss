import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportControllerService } from '@lotus/postral-core-frontend/client';
import { EXTERNAL_ITEM_CLASS_COMISSION_PREFIX, EXTERNAL_PLATFORM_COMISSION_PREFIX, PAYMENT_CHANNEL_FEE_PREFIX, PAYMENT_SERVICE_FEE, PLATFORM_COMISSION_TOTAL, POSTRAL_INSTANCE, ReportExpenseDTO, ReportFullDTO, ReportItemDTO, ReportPlatformDTO } from '@tk-postral/payment-common';
import { of } from 'rxjs';
import { ReportInfoComponent } from './report-info.component';

@Pipe({ name: 'translate' })
class TranslateStubPipe implements PipeTransform {
  transform(text: string | { key: string; parameters?: { platform?: string; itemClass?: string; channel?: string } }): string {
    const value = typeof text === 'string' ? text : text.key;
    const params = typeof text === 'string' ? undefined : text.parameters;
    if (value === 'postral.expense.PAYMENT_CHANNEL_FEE') {
      return `${params?.channel} payment service fee`;
    }
    if (value === 'postral.expense.EXTERNAL_PLATFORM_COMISSION') {
      return `${params?.platform} commission (total)`;
    }
    if (value === 'postral.expense.EXTERNAL_ITEM_CLASS_COMISSION') {
      return `${params?.platform} commission for ${params?.itemClass}`;
    }
    return value === 'postral.reports.no-id' ? 'no id' : value;
  }
}

@Component({ selector: 'lib-money-display', template: '{{ amount }} {{ currency }}' })
class MoneyDisplayStubComponent {
  @Input() amount: number | null | undefined;
  @Input() currency: string | null | undefined;
}

// eslint-disable-next-line @angular-eslint/component-selector -- Match the existing workspace component in the template.
@Component({ selector: 'lotus-web-status-badge', template: '{{ label }}' })
class StatusBadgeStubComponent {
  @Input() color = '';
  @Input() label = '';
}

// eslint-disable-next-line @angular-eslint/component-selector -- Match the existing workspace component in the template.
@Component({ selector: 'block-button', template: '{{ stringContent }}' })
class ButtonStubComponent {
  @Input() buttonClass = '';
  @Input() stringContent = '';
  @Input() iconClass = '';
  @Input() iconContent = '';
}

describe('ReportInfoComponent sales breakdown', () => {
  let fixture: ComponentFixture<ReportInfoComponent>;
  const reports = { getReportById: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    await TestBed.configureTestingModule({
      declarations: [ReportInfoComponent],
      imports: [
        DatePipe, DecimalPipe, TranslateStubPipe, MoneyDisplayStubComponent,
        StatusBadgeStubComponent, ButtonStubComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 'report' }) } },
        { provide: Router, useValue: {} },
        { provide: ReportControllerService, useValue: reports },
        { provide: BasicOverlayService, useValue: {} },
      ],
    }).compileComponents();
  });

  const render = async (values: Partial<ReportFullDTO>): Promise<HTMLElement> => {
    reports.getReportById.mockReturnValue(of(Object.assign(new ReportFullDTO(), {
      id: 'report', currency: 'TRY', reportType: 'SELLER', archived: true, ...values,
    })));
    fixture = TestBed.createComponent(ReportInfoComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders direct and external platform names, counters and monetary values in report currency', async () => {
    const platforms = [
      Object.assign(new ReportPlatformDTO(), {
        id: 'direct', platformKey: POSTRAL_INSTANCE, platformName: 'Postral',
        purchaseCount: 3, refundCount: 1, soldQuantity: 4.5, refundedQuantity: 1,
        totalSaleAmount: 540, totalRefundAmount: 120, netSaleAmount: 420, netRevenue: 350,
      }),
      Object.assign(new ReportPlatformDTO(), {
        id: 'external', externalPlatformId: 'marketplace', platformKey: 'MARKETPLACE',
        platformName: 'Marketplace', purchaseCount: 2, soldQuantity: 2,
        totalSaleAmount: 240, netSaleAmount: 240, netRevenue: 200,
      }),
    ];
    const element = await render({ platforms });
    const cards = element.querySelectorAll('.platform-item');
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toContain('postral.reports.postral-instance');
    expect(cards[1].textContent).toContain('Marketplace (MARKETPLACE)');
    const directCounts = Array.from(cards[0].querySelectorAll('.value')).map(node => node.textContent?.trim());
    expect(directCounts).toEqual(['3', '1', '4.5', '1']);
    const amounts = Array.from(cards[0].querySelectorAll('lib-money-display')).map(node => node.textContent?.trim());
    expect(amounts).toEqual(['540 TRY', '120 TRY', '420 TRY', '350 TRY']);
  });

  it('adds the no-id suffix only to name-based items and omits empty variation parentheses', async () => {
    const items = [
      Object.assign(new ReportItemDTO(), { id: 'named', reportItemKey: 'named', itemId: '', itemName: 'External product', itemVariation: '', identifiedByName: true }),
      Object.assign(new ReportItemDTO(), { id: 'catalog', reportItemKey: 'catalog', itemId: 'catalog', itemName: 'Catalog product', itemVariation: 'blue' }),
    ];
    const element = await render({ items });
    const titles = element.querySelectorAll('.expense-item h3');
    expect(titles[0].textContent).toContain('External product');
    expect(titles[0].textContent).toContain('(no id)');
    expect(titles[0].textContent).not.toContain('()');
    expect(titles[1].textContent).toContain('Catalog product');
    expect(titles[1].textContent).toContain('(blue)');
    expect(titles[1].textContent).not.toContain('no id');
  });

  it('handles old payloads without platform arrays and labels legacy ID-less items', async () => {
    const element = await render({
      platforms: undefined,
      items: [Object.assign(new ReportItemDTO(), { reportItemKey: 'legacy', itemName: 'Legacy', itemId: '' })],
    });
    expect(element.textContent).toContain('postral.reports.platforms-history-note');
    expect(element.textContent).toContain('postral.reports.platforms-empty');
    expect(element.textContent).toContain('(no id)');
  });

  it.each(['PLATFORM', 'PLATFORM_SELLER'] as const)('does not show a sales-platform section for %s commission reports', async reportType => {
    const element = await render({ reportType });
    expect(element.querySelector('.platforms-section')).toBeNull();
  });

  it('shows the sales-platform section for platform flow reports', async () => {
    const element = await render({ reportType: 'PLATFORM_FLOW' });
    expect(element.querySelector('.platforms-section')).not.toBeNull();
  });

  it('labels external expense totals and classes with the platform, keeping Postral totals distinct', async () => {
    const element = await render({ expenses: [
      Object.assign(new ReportExpenseDTO(), { expenseKey: PLATFORM_COMISSION_TOTAL, expenseAmount: 20 }),
      Object.assign(new ReportExpenseDTO(), { expenseKey: EXTERNAL_PLATFORM_COMISSION_PREFIX + 'TRENDYOL', expenseAmount: 50 }),
      Object.assign(new ReportExpenseDTO(), { expenseKey: EXTERNAL_ITEM_CLASS_COMISSION_PREFIX + 'MARKET%3ATR:BOOK%3APRINT', expenseAmount: 15 }),
    ] });
    const titles = Array.from(element.querySelectorAll('.expense-item h3')).map(node => node.textContent?.trim());
    expect(titles).toEqual([
      'postral.expense.PLATFORM_COMISSION_TOTAL',
      'TRENDYOL commission (total)',
      'MARKET:TR commission for BOOK:PRINT',
    ]);
    const amounts = Array.from(element.querySelectorAll('.expense-item lib-money-display')).map(node => node.textContent?.trim());
    expect(amounts).toEqual(['20 TRY', '50 TRY', '15 TRY']);
  });

  it('labels per-channel payment service fees with the decoded channel id', async () => {
    const element = await render({ expenses: [
      Object.assign(new ReportExpenseDTO(), { expenseKey: PAYMENT_SERVICE_FEE, expenseAmount: 7 }),
      Object.assign(new ReportExpenseDTO(), { expenseKey: PAYMENT_CHANNEL_FEE_PREFIX + 'iyzico', expenseAmount: 5 }),
      Object.assign(new ReportExpenseDTO(), { expenseKey: PAYMENT_CHANNEL_FEE_PREFIX + 'market%3Atr', expenseAmount: 2 }),
    ] });
    const titles = Array.from(element.querySelectorAll('.expense-item h3')).map(node => node.textContent?.trim());
    expect(titles).toEqual([
      'postral.expense.PAYMENT_SERVICE_FEE',
      'iyzico payment service fee',
      'market:tr payment service fee',
    ]);
  });
});
