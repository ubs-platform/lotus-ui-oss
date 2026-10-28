import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, input } from '@angular/core';
import * as ChartJs from 'chart.js';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
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
  options = input<ChartJs.ChartOptions>({});

  chartType = input<ChartJs.ChartType>('line', { alias: 'type' });

  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;

  constructor(private ngxTranslateService: TranslatorRepositoryService) { }

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
    const translator = this.ngxTranslateService;
    const optionsInject = {
      plugins: {
        legend: {
          labels: {
            generateLabels: function (chart: ChartJs.Chart) {
              // Chart.js'in varsayılan legend dizisini alıyoruz
              const originalLabels = ChartJs.Chart.defaults.plugins.legend.labels.generateLabels(chart);

              // Her bir legend öğesinin metnini sözlüğe göre güncelliyoruz
              return originalLabels.map(label => {
                const translationKey = label.text; // 'revenue' veya 'expenses'

                // Eğer sözlükte karşılığı varsa çeviriyi koy, yoksa orijinali bırak
                label.text = translator?.getString(translationKey || '') as string;
                return label;
              });
              // generateLabels: (label: string) => this.ngxTranslateService?.getString(label || '') as string
            }
            // formatter: (label: string) => this.ngxTranslateService?.getString(label || '') as string
          }
        }
      }
    };
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
        this.chartActive.options = { ...this.options(), ...optionsInject };
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
      options: { ...this.options(), ...optionsInject }
    });
    this.activeChartType = chartType;
  }
}
