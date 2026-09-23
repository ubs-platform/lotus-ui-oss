import { Component, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { RefundControllerService } from '@lotus/postral-core-frontend/client';
import { RefundRequestResolutionDialogComponent } from '../refund-request-resolution-dialog/refund-request-resolution-dialog.component';

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
    this.perform(refundId, status);
  }

  private perform(refundId: string, status: "rejected" | "approved") {
    const action = status === 'approved' ? 'APPROVED' : 'REJECTED';
    this.overlayService
      .showComponentAsDialog(RefundRequestResolutionDialogComponent, {
        title: action === 'APPROVED'
          ? 'postral.refund.approve-confirm-title'
          : 'postral.refund.reject-confirm-title',
        data: { action },
        defaultOutValue: null,
      })
      .onClose()
      .subscribe((result) => {
        if (!result) return;
        const request = action === 'APPROVED'
          ? this.refundService.approveRefundRequest(refundId, result)
          : this.refundService.rejectRefundRequest(refundId, result);
        request.subscribe(() => this.table()?.loadData());
      });
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
