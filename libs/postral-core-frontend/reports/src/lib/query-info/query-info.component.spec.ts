import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportQueryControllerService } from '@lotus/postral-core-frontend/client';
import { of } from 'rxjs';
import { QueryInfoComponent } from './query-info.component';

describe('QueryInfoComponent creation defaults', () => {
  const queries = { get: jest.fn(), create: jest.fn(), update: jest.fn() };

  const initialize = (params: Record<string, string>, id = 'create'): QueryInfoComponent => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({ id }),
          snapshot: { queryParamMap: convertToParamMap(params) },
        } },
        { provide: ReportQueryControllerService, useValue: queries },
        { provide: BasicOverlayService, useValue: { alert: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });
    const component = TestBed.runInInjectionContext(() => new QueryInfoComponent(
      TestBed.inject(ActivatedRoute), TestBed.inject(BasicOverlayService),
      TestBed.inject(ReportQueryControllerService), TestBed.inject(Router),
    ));
    component.ngOnInit();
    return component;
  };

  beforeEach(() => jest.resetAllMocks());

  it('prefills the seller filters without creating a query automatically', () => {
    const component = initialize({
      ownerAccountId: 'seller', currency: 'EUR', dateGrouping: 'MONTHLY', reportType: 'PLATFORM',
    });
    expect(component.instruction()?.form.value).toMatchObject({
      ownerAccountId: 'seller', currency: 'EUR', dateGrouping: 'MONTHLY', reportType: 'SELLER',
    });
    expect(queries.create).not.toHaveBeenCalled();
    expect(queries.get).not.toHaveBeenCalled();
  });

  it('preserves normal defaults when opening an unfiltered creation form', () => {
    const component = initialize({});
    expect(component.instruction()?.form.value).toMatchObject({
      name: '', dateGrouping: 'DAILY', reportType: 'SELLER',
    });
  });

  it('ignores unsupported currency and grouping parameters', () => {
    const component = initialize({ currency: 'INVALID', dateGrouping: 'INVALID' });
    expect(component.instruction()?.form.value.currency).toBeUndefined();
    expect(component.instruction()?.form.value.dateGrouping).toBe('DAILY');
  });

  it('does not overwrite existing queries with URL creation defaults', () => {
    queries.get.mockReturnValue(of({
      id: 'saved', name: 'Saved query', ownerAccountId: 'original', currency: 'TRY',
      dateGrouping: 'DAILY', reportType: 'SELLER',
    }));
    const component = initialize({
      ownerAccountId: 'different', currency: 'EUR', dateGrouping: 'MONTHLY',
    }, 'saved');
    expect(component.instruction()?.form.value).toMatchObject({
      id: 'saved', ownerAccountId: 'original', currency: 'TRY', dateGrouping: 'DAILY',
    });
  });
});
