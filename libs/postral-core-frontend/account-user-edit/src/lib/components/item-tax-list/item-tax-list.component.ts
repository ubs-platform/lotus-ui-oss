import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@lotus-web/environment';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import {
  ItemTaxControllerService,
} from '@lotus/postral-core-frontend/client';

@Component({
  selector: 'libItemTaxList',
  standalone: false,
  templateUrl: './item-tax-list.component.html',
  styleUrls: ['./item-tax-list.component.scss'],
})
export class ItemTaxListComponent implements OnInit, OnDestroy {
  admin = signal<boolean>(false);
  table = viewChild<SearchableDataTableComponent>('table');

  /** 
  * ☠️☠️
  */
  tayyip = signal(false);
  
  constructor(
    private itemTaxService: ItemTaxControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: BasicOverlayService,
  ) { }

  ngOnDestroy(): void {
    // window.document.body.style.background = "";

  }

  ngOnInit(): void {
    this.tayyip.set(!environment.production);

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
    this.itemTaxService.delete(itemId).subscribe(() => {
      // Refresh the list after deletion
      // this.addressService.list().subscribe();
      this.table()?.loadData();
    });
  }

  createItemTax() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
