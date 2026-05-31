import { Component, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import { AccountControllerService, AccountUserControllerService, AddressControllerService } from '@lotus/postral-core-frontend/client';
import { AccountDTO, AccountAddressDto } from '@tk-postral/payment-common';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
@Component({
  selector: 'lib-address-list',
  standalone: false,
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
})
export class AddressListComponent {
  table = viewChild<SearchableDataTableComponent>('table');
  admin = signal<boolean>(false);
  constructor(
    private addressService: AddressControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: BasicOverlayService,
    private teamService: PublisherTeamService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      // console.log(data);
      if (data['admin']) {
        this.admin.set(true);
      }
    });
  }

  deleteAddress(addressId: string) {
    this.overlayService.confirm('Emin misiniz?', 'Bu adresi silmek istediğinize emin misiniz?').subscribe((confirmed) => {
      if (confirmed) {
        this.performDelete(addressId);
      }
    });
  }

  private performDelete(addressId: string) {
    this.addressService.delete(addressId).subscribe(() => {
      // Refresh the list after deletion
      // this.addressService.list().subscribe();
      this.table()?.loadData();
    });
  }


  createAddress() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
