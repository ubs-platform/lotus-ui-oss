import { Component, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { RefundControllerService } from '@lotus/postral-core-frontend/client';

@Component({
  selector: 'libRefundRequestList',
  standalone: false,
  templateUrl: './refund-request-list.component.html',
  styleUrl: './refund-request-list.component.scss',
})
export class RefundRequestListComponent {
  table = viewChild<SearchableDataTableComponent>('table');
  admin = signal<boolean>(false);
  constructor(
    private refundService: RefundControllerService,
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

  deleteRefund(refundId: string, status: "rejected" | "approved") {
    // TODO :Çeviri için tr-tr ve en-us jsonu güncellenecek 
    this.overlayService.confirm('Emin misiniz?', "Yeni iade durumu: " + (status == 'approved' ? 'Onaylandı' : 'Reddedildi') + '. Bu iade talebini sonlandırmak istediğinize emin misiniz?').subscribe((confirmed) => {
      if (confirmed) {
        this.perform(refundId, status);
      }
    });
  }

  private perform(refundId: string, status: "rejected" | "approved") {
    if (status === "approved") {
      this.refundService.approveRefundRequest(refundId).subscribe(() => {
        // Refresh the list after approval
        // this.addressService.list().subscribe();
        this.table()?.loadData();
      });
    } else if (status === "rejected") {
      this.refundService.rejectRefundRequest(refundId).subscribe(() => {
        // Refresh the list after rejection
        // this.addressService.list().subscribe();
        this.table()?.loadData();
      });
    }
   
  }


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
