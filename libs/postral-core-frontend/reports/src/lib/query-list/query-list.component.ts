import { Component, signal, viewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { ItemCrudService, ReportQueryControllerService } from '@lotus/postral-core-frontend/client';
import { ReportQueryDTO } from '@tk-postral/payment-common';
@Component({
  selector: 'lib-query-list',
  standalone: false,
  templateUrl: './query-list.component.html',
  styleUrl: './query-list.component.scss',
})
export class QueryListComponent {

  admin = signal<boolean>(false);
  table = viewChild<SearchableDataTableComponent>('table');

  constructor(
    private queryService: ReportQueryControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: BasicOverlayService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      // console.log(data);
      if (data['admin']) {
        this.admin.set(true);
      }
    });
  }

  deleteItem(itemId: string) {
    this.overlayService
      .confirm('Emin misiniz?', 'Bu ürünü silmek istediğinize emin misiniz?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.performDelete(itemId);
        }
      });
  }

  private performDelete(itemId: string) {
    this.queryService.delete(itemId).subscribe(() => {
      this.table()?.loadData();
    });
  }

  createItem() {
    //saçma sapan bir şey ama kalsın şu an :D
    this.editItem({ "id": "new" } as any)
  }

  editItem(item: ReportQueryDTO) {
    // throw new Error('Method not implemented.');
    this.router.navigate([`report-query/${item.id}`], {
      relativeTo: this.activatedRoute.parent,
    });
  }
  listReportsOf(item: ReportQueryDTO) {
    this.router.navigate([`report-query/${item.id}/reports`], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}
