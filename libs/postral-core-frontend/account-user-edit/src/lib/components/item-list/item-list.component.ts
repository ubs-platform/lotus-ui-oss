import { Component, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { SearchableDataTableComponent } from '@lotus/front-global/table';
import {
  AccountControllerService,
  AccountUserControllerService,
  AddressControllerService,
  ItemAdminControllerService,
  ItemCrudService,
} from '@lotus/postral-core-frontend/client';
import {
  AccountDTO,
  AccountAddressDto,
  UNIT_TYPES_MAPPED,
} from '@tk-postral/payment-common';

@Component({
  selector: 'libItemList',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent {
  admin = signal<boolean>(false);
  table = viewChild<SearchableDataTableComponent>('table');
  constructor(
    private itemService: ItemCrudService,
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
    this.itemService.delete(itemId).subscribe(() => {
      // Refresh the list after deletion
      // this.addressService.list().subscribe();
      this.table()?.loadData();
    });
  }

  createItem() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
    // this.addressService
    //   .create({
    //     name: 'Yeni adres',
    //     country: "TURKIYE",
    //     cityName: "İSTANBUL",
    //     citySubdivisionName: "BAHÇELİEVLER",
    //     postalZone: "34180",
    //     streetName: "Deneme Sokak",
    //     buildingNumber: "42",
    //     floor: "3",
    //     room: "5"
    //   } as AccountAddressDto)
    //   .subscribe((address) => {
    //     // Navigate to the address edit page
    //     this.router.navigate([`address/${address.id}`], {relativeTo: this.activatedRoute.parent})
    //   });
  }
}
