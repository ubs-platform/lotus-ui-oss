import { Component, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { AppComissionControllerService } from '@lotus/postral-core-frontend/client';
import { AppComissionDTO } from '@tk-postral/payment-common';

@Component({
  selector: 'libComissionList',
  standalone: false,
  templateUrl: './comission-list.component.html',
  styleUrls: ['./comission-list.component.scss'],
})
export class ComissionListComponent {
  table = viewChild<SearchableDataTableComponent>('table');
  constructor(
    private appComissionService: AppComissionControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: BasicOverlayService
  ) { }

  ngOnInit(): void {

  }

  createComission() {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  editComission(item: AppComissionDTO) {
    this.router.navigate([item.id], { relativeTo: this.activatedRoute, state: item });
  }

  goToCreate() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  removeComission(id: string) {
    this.overlayService.confirm('Emin misiniz?', 'Bu komisyonu silmek istediğinize emin misiniz?').subscribe((confirmed) => {
      if (confirmed) {
        this.appComissionService.removeById(id).subscribe(() => {
          this.table()?.loadData();
        });
      }
    });

    // deleteRefund(refundId: string, status: "rejected" | "approved") {
    //   // TODO :Çeviri için tr-tr ve en-us jsonu güncellenecek 
    //   this.overlayService.confirm('Emin misiniz?', "Yeni iade durumu: " + (status == 'approved' ? 'Onaylandı' : 'Reddedildi') + '. Bu iade talebini sonlandırmak istediğinize emin misiniz?').subscribe((confirmed) => {
    //     if (confirmed) {
    //       this.perform(refundId, status);
    //     }
    //   });
    // }



    // createRefund() {
    //   this.refundService
    //     .createRefundRequest({
    //       reason: 'Yeni iade talebi',
    //     } )
    //     .subscribe((address) => {
    //       // Navigate to the address edit page
    //       this.router.navigate([`address/${address.id}`], {relativeTo: this.activatedRoute.parent})
    //     });
    // }
  }
}