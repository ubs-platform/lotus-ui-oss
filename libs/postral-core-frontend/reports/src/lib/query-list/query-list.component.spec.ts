import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReportQueryControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportSetupWizardService } from '../report-setup/report-setup-wizard.service';
import { QueryListComponent } from './query-list.component';

describe('QueryListComponent report setup', () => {
  const wizard = { open: jest.fn() };
  let component: QueryListComponent;
  const route = {
    data: of({ admin: false }),
    pathFromRoot: [{ snapshot: { data: { paymentMode: 'seller' } } }],
  };

  beforeEach(() => {
    jest.resetAllMocks();
    route.data = of({ admin: false });
    route.pathFromRoot[0].snapshot.data.paymentMode = 'seller';
    wizard.open.mockReturnValue(of(true));
    TestBed.configureTestingModule({
      providers: [
        QueryListComponent,
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: {} },
        { provide: BasicOverlayService, useValue: {} },
        { provide: ReportQueryControllerService, useValue: {} },
        { provide: ReportSetupWizardService, useValue: wizard },
      ],
    });
    component = TestBed.inject(QueryListComponent);
  });

  it('opens the reusable wizard from the seller query list', () => {
    component.ngOnInit();
    component.setupReports();
    expect(wizard.open).toHaveBeenCalledWith();
  });

  it('does not open seller setup in admin mode', () => {
    route.data = of({ admin: true });
    component.ngOnInit();
    component.setupReports();
    expect(wizard.open).not.toHaveBeenCalled();
  });

  it('does not open seller setup in customer mode', () => {
    route.pathFromRoot[0].snapshot.data.paymentMode = 'customer';
    component.ngOnInit();
    component.setupReports();
    expect(wizard.open).not.toHaveBeenCalled();
  });
});
