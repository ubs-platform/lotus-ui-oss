import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountUserInfoComponent } from './components/account-user-info/account-user-info.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { AccountUserEditRouterModule } from './account-user-edit-router.module';
import { ReformDataEditComponent } from '@lotus/front-global/reform-data-edit';
import { AccountsComponent } from './components/accounts/accounts.component';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { RouterModule } from '@angular/router';
import { AddressListComponent } from './components/address-list/address-list.component';
import { PaymentSettingsWrapComponent } from './components/payment-settings-wrap/payment-settings-wrap.component';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { AddressInfoComponent } from './components/address-info/address-info.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { ItemTaxListComponent } from './components/item-tax-list/item-tax-list.component';
import { TaxInfoComponent } from './components/tax-info/tax-info.component';
import { UbsTouchNgxModule } from '@lotus/front-global/ubs-touch-ngx';
import { TabViewComponent } from '@lotus/front-global/tab-view';
import { ItemPriceListComponent } from './components/item-price-list/item-price-list.component';
import { DataListLayoutModule } from '@lotus/front-global/ui/data-list-layout';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { TransactionInfoComponent } from './components/transaction-info/transaction-info.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceInfoComponent } from './components/invoice-info/invoice-info.component';
import { PaymentItemListComponent } from '@lotus/postral-core-frontend/payment-item-list';
import { InvoiceModule } from '@lotus/postral-core-frontend/invoice';
import { FrontGlobalStatusBadgeModule } from '@lotus/front-global/status-badge';
import { RefundRequestDialogComponent } from './components/refund-request-dialog/refund-request-dialog.component';
import { RefundRequestListComponent } from './components/refund-request-list/refund-request-list.component';
import { RefundRequestInfoComponent } from './components/refund-request-info/refund-request-info.component';
import { WebdialogComponent } from '@lotus/front-global/webdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CustomSelectComponent } from '@lotus/legendary-front/custom-select';
import { PostralReportsModule } from '@lotus/postral-core-frontend/reports';
import { SidebarPageActionHolderComponent } from './components/sidebar-page-action-holder/sidebar-page-action-holder.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { WebhookConfigInfoComponent } from './components/webhook-config-info/webhook-config-info.component';
import { WebhookConfigListComponent } from './components/webhook-config-list/webhook-config-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReformDataEditComponent,
    AccountUserEditRouterModule,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    RouterModule,
    FrontGlobalSidebarModule,
    UbsTouchNgxModule,
    TabViewComponent,
    DataListLayoutModule,
    PaymentItemListComponent,
    InvoiceModule,
    FrontGlobalStatusBadgeModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
    WebdialogComponent,
    SelectButtonModule,
    CustomSelectComponent,
    UbsTranslatorNgxModule,
    PostralReportsModule,
  ],
  declarations: [
    AccountUserInfoComponent,
    AccountsComponent,
    AddressListComponent,
    PaymentSettingsWrapComponent,
    AddressInfoComponent,
    ItemListComponent,
    ItemInfoComponent,
    ItemTaxListComponent,
    TaxInfoComponent,
    ItemPriceListComponent,
    PaymentHistoryComponent,
    TransactionHistoryComponent,
    PaymentInfoComponent,
    TransactionInfoComponent,
    InvoiceListComponent,
    InvoiceInfoComponent,
    RefundRequestDialogComponent,
    RefundRequestListComponent,
    RefundRequestInfoComponent,
    SidebarPageActionHolderComponent,
    WebhookConfigInfoComponent,
    WebhookConfigListComponent,
  ],
  exports: [
    AccountUserInfoComponent,
    AccountsComponent,
    AddressListComponent,
    ItemListComponent,
    ItemInfoComponent,
    ItemTaxListComponent,
    TaxInfoComponent,
    PaymentHistoryComponent,
    PaymentInfoComponent,
    TransactionHistoryComponent,
    TransactionInfoComponent,
    InvoiceInfoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountUserEditModule {}
