import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportControllerService } from '@lotus/postral-core-frontend/client';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportDTO, ReportFullDTO, ReportTaxGroupDTO } from '@tk-postral/payment-common';
import { Optional } from '@ubs-platform/crud-base-common/utils';

@Component({
  selector: 'lib-report-info',
  standalone: false,
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss'],
})
export class ReportInfoComponent implements OnInit {
  reportId: string = '';
  reportInfo = signal<Optional<ReportFullDTO>>(null);
  loading = signal<boolean>(true);
  error = signal<Optional<string>>(null);

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private reportControllerService: ReportControllerService,
    private basicOverlay: BasicOverlayService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.reportId = params['id'];
      if (!this.reportId) {
        this.notFound();
        return;
      }

      this.loading.set(true);
      this.reportControllerService.getReportById(this.reportId).subscribe({
        next: (report) => {
          if (!report) {
            this.notFound();
            return;
          }
          this.reportInfo.set(report as ReportFullDTO);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || 'Rapor bilgisi alınamadı');
        },
      });
    });
  }

  reconstructReport() {
    this.reportControllerService.reconstructReports(this.reportId, true).subscribe({
      next: () => {
        this.basicOverlay.alert(
          'Rapor tekrar oluşturuluyor',
          'İsteğiniz alınmıştır. Bu işlem uzun sürebileceğinden dolayı daha sonra tekrar kontrol edebilirsiniz.',
          'info'
        );
      },
      error: (err) => {
        this.basicOverlay.alert(
          'Hata',
          'Rapor tekrar oluşturulurken hata oluştu. Lütfen daha sonra tekrar deneyiniz.',
          'error'
        );
      },
    });
  }

  private notFound() {
    this.loading.set(false);
    this.error.set('Rapor bulunamadı');
  }
}
