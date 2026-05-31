import { FrontGlobalButtonModule } from 'libs/front-global/button/src/lib/front-global-button.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SaleSimulationRoutesModule } from './sale-simulation-routes.module';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SaleSimulationWrapComponent } from './components/sale-simulation-wrap/sale-simulation-wrap.component';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { RouterModule } from '@angular/router';
import { PriceButtonsComponent } from './components/price-buttons/price-buttons.component';
import { BasketViewComponent } from './components/basket-view/basket-view.component';
import { PostralCoreFrontendClientModule } from '@lotus/postral-core-frontend/client';
import { PaymentItemListComponent } from '@lotus/postral-core-frontend/payment-item-list';
import { PostralReportsModule } from '@lotus/postral-core-frontend/reports';

@NgModule({
  declarations: [
    OrdersComponent,
    PaymentComponent,
    SaleSimulationWrapComponent,
    PriceButtonsComponent,
    BasketViewComponent
  ],
  imports: [
    CommonModule,
    SaleSimulationRoutesModule,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    RouterModule,
    PostralCoreFrontendClientModule,
    PaymentItemListComponent,
    PostralReportsModule
  ],
})
export class SaleSimulationModule {}
