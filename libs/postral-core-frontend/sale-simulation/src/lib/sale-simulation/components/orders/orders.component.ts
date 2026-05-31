import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCrudService, PaymentControllerService } from '@lotus/postral-core-frontend/client';
import { OrderManagement } from '../../util/order-management';
@Component({
  selector: 'lib-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {

  orderManagement = model<OrderManagement>(new OrderManagement());

  /**
   *
   */
  constructor(private itemService: ItemCrudService) {
    
  }

  onInit(): void {
    this.itemService.getAll().subscribe((data) => {
      console.log('Items', data);
    });
  }
}
