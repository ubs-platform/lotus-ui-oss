import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { TranslatorRepositoryService, UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { of } from 'rxjs';
import { AdminOperationsComponent } from './admin-operations.component';

describe('AdminOperationsComponent', () => {
  let component: AdminOperationsComponent;
  let fixture: ComponentFixture<AdminOperationsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOperationsComponent],
      imports: [HttpClientTestingModule, UbsTranslatorNgxModule],
      providers: [
        {
          provide: TranslatorRepositoryService,
          useValue: {
            getString: (value: string) => value,
            getStringListenChanges: (value: string) => of(value),
          },
        },
        {
          provide: BasicOverlayService,
          useValue: { alert: jest.fn(), confirm: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOperationsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests a payment cleanup preview with the selected date', () => {
    component.previewPaymentCleanup('2026-01-01');

    const request = httpTestingController.expectOne('/service/payment/api/admin-operations/payment-cleanup/preview');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.before).toBe('2026-01-01T00:00:00.000Z');
    request.flush({
      paymentIds: [],
      preservedReportQueryCount: 1,
      affectedReportIds: [],
      counts: {},
      warnings: [],
    });
    expect(component.paymentCleanupLoading).toBe(false);
  });
});
