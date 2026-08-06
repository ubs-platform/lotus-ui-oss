import { NgModule } from '@angular/core';
import { AccountUserInfoComponent } from './components/account-user-info/account-user-info.component';
import { RouterModule } from '@angular/router';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AddressListComponent } from './components/address-list/address-list.component';
import { PaymentSettingsWrapComponent } from './components/payment-settings-wrap/payment-settings-wrap.component';
import { AddressInfoComponent } from './components/address-info/address-info.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { ItemTaxListComponent } from './components/item-tax-list/item-tax-list.component';
import { TaxInfoComponent } from './components/tax-info/tax-info.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { TransactionInfoComponent } from './components/transaction-info/transaction-info.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceInfoComponent } from './components/invoice-info/invoice-info.component';
import { RefundRequestListComponent } from './components/refund-request-list/refund-request-list.component';
import { RefundRequestInfoComponent } from './components/refund-request-info/refund-request-info.component';
import { QueryListComponent, QueryInfoComponent, ReportInfoComponent, ReportListComponent } from '@lotus/postral-core-frontend/reports';
import { NotFoundPageComponent } from '@lotus/front-global/error-status-pages';
import { WebhookConfigInfoComponent } from './components/webhook-config-info/webhook-config-info.component';
import { WebhookConfigListComponent } from './components/webhook-config-list/webhook-config-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PaymentSettingsWrapComponent,
        children: [
          { path: '', redirectTo: 'address', pathMatch: 'full' },
          { path: 'address', component: AddressListComponent },
          { path: 'address/:id', component: AddressInfoComponent },
          { path: 'account', component: AccountsComponent },
          { path: 'account/:id', component: AccountUserInfoComponent },
          { path: 'item', component: ItemListComponent },
          { path: 'item/:id', component: ItemInfoComponent },
          { path: 'invoice/history', component: InvoiceListComponent },
          { path: 'invoice/:invoiceId', component: InvoiceInfoComponent },
          { path: 'tax', component: ItemTaxListComponent },
          { path: 'tax/:id', component: TaxInfoComponent },
          { path: 'refund/requests', component: RefundRequestListComponent },
          { path: 'refund/:id', component: RefundRequestInfoComponent },
          {
            path: "payment/history", component: PaymentHistoryComponent, data: {
              seller: true
            }
          },
          {
            path: "payment/:paymentId", component: PaymentInfoComponent
          },
          {
            path: "transaction/history", component: TransactionHistoryComponent, data: {
              admin: false
            }
          },
          {
            path: "transaction/:sellerPaymentOrderId", component: TransactionInfoComponent,
          },
          {
            path: "report-query", component: QueryListComponent
          },
          {
            path: "report-query/:id", component: QueryInfoComponent
          },
          {
            path: "report-query/:queryId/reports", component: ReportListComponent
          },
          {
            path: "reports", component: ReportListComponent
          },
          {
            path: "reports/:id", component: ReportInfoComponent
          },
          {
            path: "webhook", component: WebhookConfigListComponent
          },
          {
            path: "webhook/:accountId", component: WebhookConfigInfoComponent
          },
          {
            component: NotFoundPageComponent,
            path: '**',
          },
        ],
      },
    ]),
  ],
})
export class AccountUserEditRouterModule { }
