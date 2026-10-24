import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import * as ChartJs from 'chart.js';

jest.mock('chart.js', () => ({
  Chart: Object.assign(jest.fn().mockImplementation((canvas: HTMLCanvasElement, config: { data: unknown; options: unknown }) => ({
    canvas,
    data: config.data,
    options: config.options,
    update: jest.fn(),
    destroy: jest.fn(),
    resize: jest.fn(),
  })), { register: jest.fn() }),
  registerables: [],
}));

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [ChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates data and options without recreating an unchanged chart type', () => {
    const chart = jest.mocked(ChartJs.Chart).mock.results[0].value;
    const data = { labels: ['2026-10'], datasets: [{ data: [100] }] };
    fixture.componentRef.setInput('data', data);
    fixture.componentRef.setInput('options', { indexAxis: 'y' });
    fixture.detectChanges();
    expect(ChartJs.Chart).toHaveBeenCalledTimes(1);
    expect(chart.data).toEqual(data);
    expect(chart.options).toEqual({ indexAxis: 'y' });
    expect(chart.update).toHaveBeenCalled();
  });

  it('recreates the chart when switching between line and bar', () => {
    const chart = jest.mocked(ChartJs.Chart).mock.results[0].value;
    fixture.componentRef.setInput('type', 'bar');
    fixture.detectChanges();
    expect(chart.destroy).toHaveBeenCalledTimes(1);
    expect(ChartJs.Chart).toHaveBeenCalledTimes(2);
    expect(jest.mocked(ChartJs.Chart).mock.calls[1][1]).toMatchObject({ type: 'bar' });
  });

  it('destroys the active chart with the component', () => {
    const chart = jest.mocked(ChartJs.Chart).mock.results[0].value;
    fixture.destroy();
    expect(chart.destroy).toHaveBeenCalledTimes(1);
  });
});
