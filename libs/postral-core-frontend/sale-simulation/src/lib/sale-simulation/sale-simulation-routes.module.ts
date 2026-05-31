import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { SaleSimulationWrapComponent } from './components/sale-simulation-wrap/sale-simulation-wrap.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { BlockPartBaseButtonComponent } from 'libs/front-global/button/src/lib/block-part-base-button/block-part-base-button.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
@NgModule({
  declarations: [],
  imports: [
    
    RouterModule.forChild([
      {
        path: '',
        component: SaleSimulationWrapComponent,
        children: [
          {
            path: '',
            redirectTo: 'orders',
            pathMatch: 'full',
          },
          {
            component: OrdersComponent,
            path: 'orders',
          },
          {
            component: PaymentComponent,
            path: 'payment/:paymentId',
          },
        ],
      },
    ] as Route[]),
  ],
  exports: [],
})
export class SaleSimulationRoutesModule {}
