import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import type { ReportDTO } from '@tk-postral/payment-common';
import { PostralReportsModule } from '@lotus/postral-core-frontend/reports';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

@Component({
  selector: 'lib-report-summary-rotator',
  standalone: true,
  imports: [PostralReportsModule, UbsTranslatorNgxModule],
  templateUrl: './report-summary-rotator.component.html',
  styleUrl: './report-summary-rotator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSummaryRotatorComponent {
  readonly reports = input<ReportDTO[]>([]);
  readonly activeReport = computed(() => {
    const reports = this.reports();
    return reports.length
      ? reports[this.activeIndex() % reports.length]
      : null;
  });
  readonly visibleReports = computed(() => {
    const report = this.activeReport();
    return report ? [report] : [];
  });

  private readonly activeIndex = signal(0);

  constructor() {
    effect(onCleanup => {
      const reports = this.reports();
      this.activeIndex.set(0);

      if (reports.length < 2) {
        return;
      }

      const timerId = setInterval(() => {
        const reportCount = this.reports().length;
        if (reportCount > 1) {
          this.activeIndex.update(index => (index + 1) % reportCount);
        }
      }, 5000);

      onCleanup(() => clearInterval(timerId));
    });
  }
}
