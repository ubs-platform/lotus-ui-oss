import { Component, computed, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportControllerService, ReportQueryControllerService } from '@lotus/postral-core-frontend/client';
import { ReportDTO, ReportQueryDTO } from '@tk-postral/payment-common';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { SearchResult } from '@ubs-platform/crud-base-common';
import { StatusBadgeColor } from '@lotus/front-global/status-badge';

@Component({
  selector: 'lib-report-list',
  standalone: false,
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss',
})
export class ReportListComponent {


  @ViewChild('reportTable') reportTable?: SearchableDataTableComponent;

  query = signal<ReportQueryDTO | null>(null);
  queryId = signal<string>('');

  hideArchived = signal<boolean>(true);
  reportProgress = signal<{ [reportId: string]: string }>({});
  reportProgressColor = computed<{ [reportId: string]: StatusBadgeColor }>(() => {
    if (this.reportProgress() == null) return {};
    const colorsByReportId: { [reportId: string]: StatusBadgeColor } = {};
    for (const reportId in this.reportProgress()) {
      const progress = this.reportProgress()[reportId];
      if (progress === 'COMPLETED') colorsByReportId[reportId] = 'green';
      else if (progress === 'WAITING') colorsByReportId[reportId] = 'yellow';
      else if (progress === 'DIGESTING') colorsByReportId[reportId] = 'blue';
      else colorsByReportId[reportId] = 'gray';
    }
    return colorsByReportId;
  });
  reportSearchUrl = `/service/payment/api/report/_search`;

  reportOtherFilter = computed(() => ({ includeArchived: !this.hideArchived(), queryId: this.queryId(), admin: this.admin() }));
  admin = signal<boolean>(false);


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private reportQueryService: ReportQueryControllerService,
    private reportControllerService: ReportControllerService,
    private basicOverlay: BasicOverlayService
  ) { }

  onReportsFetched($event: SearchResult<ReportDTO>) {
    const reportIds = $event.content.map(a => a.id);
    this.reportControllerService.fetchInProgressReportIds(reportIds).subscribe({
      next: (inProgressReportIds) => {
        this.reportProgress.update(
          a => ({ ...a, ...inProgressReportIds })
        )
      },
      error: (err) => {
        console.error('Failed to fetch in-progress report ids', err);
      }
    });
  }

  toggleHideArchived() {
    this.hideArchived.update((v) => !v);
    setTimeout(() => this.reportTable?.loadData());
  }

  reconstructReport(reportId: string) {
    this.reportControllerService.reconstructReports(reportId, true).subscribe({
      next: () => {
        this.reportTable?.loadData();
        this.basicOverlay.alert(
          'Rapor tekrar oluşturuluyor',
          'İsteğiniz alınmıştır. Bu işlem uzun sürebileceğinden dolayı daha sonra tekrar kontrol edebilirsiniz.',
          'info'
        );
      },
      error: (err) => {
        console.error(err);
        this.basicOverlay.alert(
          'Hata',
          'Rapor tekrar oluşturulurken hata oluştu. Lütfen daha sonra tekrar deneyiniz.',
          'error'
        );
      },
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['queryId'];
      this.queryId.set(id);
      this.admin.set(this.activatedRoute.snapshot.data['admin'] === true);
      this.reportQueryService.get(id).subscribe({
        next: (q) => this.query.set(q),
      });
    });
  }

  viewReport(reportId: string) {
    this.router.navigate(['reports', reportId], { relativeTo: this.activatedRoute.parent });
  }
}

