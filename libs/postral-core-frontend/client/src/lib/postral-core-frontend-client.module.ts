import { NgModule } from "@angular/core";
import { AccountControllerService } from "./services/payment/account-controller.service";
import { AppComissionControllerService } from "./services/payment/app-comission-controller.service";
import { PaymentControllerService } from "./services/payment/payment-controller.service";
import { ItemAdminControllerService } from "./services/payment/item-admin-controller.service";
import { ItemCrudService } from "./services/payment/item-seller-controller.service";
import { CalculationService } from "./services/payment/calculation.service";
// import { ItemSellerControllerService } from "./services/payment/item-seller-controller.service";

@NgModule({
    imports: [],
    providers: [AccountControllerService, AppComissionControllerService, PaymentControllerService, ItemAdminControllerService, ItemCrudService, CalculationService],
})
export class PostralCoreFrontendClientModule { }