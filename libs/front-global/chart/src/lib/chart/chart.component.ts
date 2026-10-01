import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, input } from '@angular/core';
import * as ChartJs from 'chart.js';

ChartJs.Chart.register(...ChartJs.registerables);

@Component({
  selector: 'lib-chart, p-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  private chartActive?: ChartJs.Chart;
  private activeChartType?: ChartJs.ChartType;
  data = input<ChartJs.ChartData>({
    labels: [],
    datasets: []
  });
  refreshOnChange = input<boolean>(true);
  refreshOnResize = input<boolean>(true);

  chartType = input<ChartJs.ChartType>('line', { alias: 'type' });

  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.loadChart();
  }

  ngOnDestroy(): void {
    this.chartActive?.destroy();
    this.chartActive = undefined;
    this.activeChartType = undefined;
  }

  ngOnChanges(): void {
    if (!this.refreshOnChange()) {
      return;
    }
    this.loadChart();
  }

  onResize(): void {
    if (!this.refreshOnResize()) {
      return;
    }
    this.chartActive?.resize();
  }

  private loadChart(): void {
    const canvas = this.canvas?.nativeElement;
    const chartType = this.chartType();
    if (!canvas) {
      console.warn('Canvas element not found');
      return;
    }

    if (this.chartActive) {
      if (
        this.chartActive.canvas === canvas &&
        this.activeChartType === chartType
      ) {
        this.chartActive.data = this.data();
        this.chartActive.update();
        return;
      }

      this.chartActive.destroy();
      this.chartActive = undefined;
      this.activeChartType = undefined;
    }

    this.chartActive = new ChartJs.Chart(canvas, {
      type: chartType,
      data: this.data(),
      options: {}
    });
    this.activeChartType = chartType;
  }
}
