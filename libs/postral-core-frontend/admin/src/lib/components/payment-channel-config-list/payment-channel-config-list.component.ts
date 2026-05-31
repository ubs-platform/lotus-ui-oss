import { Component, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { PaymentChannelConfigControllerService } from '@lotus/postral-core-frontend/client';
import { PaymentChannelConfigDTO } from '@tk-postral/payment-common';

@Component({
  selector: 'lib-payment-channel-config-list',
  standalone: false,
  templateUrl: './payment-channel-config-list.component.html',
  styleUrls: ['./payment-channel-config-list.component.scss'],
})
export class PaymentChannelConfigListComponent {
  table = viewChild<SearchableDataTableComponent>('table');

  constructor(
    private service: PaymentChannelConfigControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: BasicOverlayService,
  ) {}

  create() {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  edit(item: PaymentChannelConfigDTO) {
    this.router.navigate([item.id], { relativeTo: this.activatedRoute, state: item });
  }

  remove(id: string) {
    this.overlayService
      .confirm('Emin misiniz?', 'Bu ödeme kanalı yapılandırmasını silmek istediğinize emin misiniz?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.service.removeById(id).subscribe(() => {
            this.table()?.loadData();
          });
        }
      });
  }
}
