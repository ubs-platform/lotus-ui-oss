import { Injector } from "@angular/core";
import { minky, minkyRoot, ValidatorResult } from "@lotus/front-global/minky/core";
import { AccountControllerService, ItemTaxControllerService, ReportQueryControllerService } from "@lotus/postral-core-frontend/client";
import { AdminSettingsDto } from "@tk-postral/payment-common";
import { map } from "rxjs";
import { getAccountIdsRelated } from "../..";

@minkyRoot()
export class AdminSettingsForm extends AdminSettingsDto {
    constructor() {
        super();
    }

    @minky({
        inputType: "slider-toggle",
        label: "postral.platform-setup.commission-from-net",
    })
    override comissionsCalculatedFromNet: boolean = false;

    @minky({
        inputType: "slider-toggle",
        label: "postral.platform-setup.seller-pays-payment-service-fee",
    })
    override sellerPaysPaymentServiceFee: boolean = false;

    // Bunun yerine veritabanında PLATFORM - DAILY olarak çekebiliriz... Çünkü birden fazla currency bunu patlatır
    // @minky({
    //     inputType: "select",
    //     label: "Rapor sorgusu (Günlük/Platform raporları için)",
    //     selectItems: (env) => {
    //         const reportQueryService = (env.app?.['injector'] as Injector).get(
    //             ReportQueryControllerService
    //         );

    //         return reportQueryService.getAll().pipe(
    //             map((a) =>
    //                 a.filter(a => a.reportType === 'PLATFORM' && a.dateGrouping === 'DAILY').map((rq) => ({
    //                     value: rq.id!,
    //                     text: rq.name + ' (' + rq.reportType + ')',
    //                 }))
    //             )
    //         );
    //     },
    // })
    // override reportQueryId?: string

    @minky({
        inputType: "select",
        label: "postral.platform-setup.commission-tax",
        selectItems: (env) => {
            const itemTaxService = (env.app?.['injector'] as Injector).get(
                ItemTaxControllerService
            );

            return itemTaxService.getAll().pipe(
                map((a) =>
                    a.map((addr) => ({
                        value: addr.id!,
                        text:
                            addr.taxName +
                            '(' +
                            addr.variations
                                .map((v) => v.taxMode + ': ' + v.taxRate + '%')
                                .join(', ') +
                            ')',
                    }))
                )
            );
        },
    })
    override comissionItemTaxId?: string | undefined;

    @minky({
        disable: true
    })
    override id: string = "";

    @minky({
        disable: true
    })
    override createdAt: Date = new Date();

    @minky({
        disable: true
    })
    override updatedAt: Date = new Date();

    @minky({
        inputType: "array",
        arrayItemInputType: "number",
        validators: [{
            labelKey: 'postral.platform-setup.billing-days-help',
            validate: (value: unknown) => new ValidatorResult(
                'postral.platform-setup.billing-days-help',
                value == null || (Array.isArray(value) && value.every(day => Number.isInteger(day) && day >= 1 && day <= 28)),
            ),
        }],
        label: 'postral.billing-dates',
    })
    override billingDays?: number[] | undefined;

    @minky({
        inputType: "select",
        label: "postral.platform-setup.billing-account",
        selectItems: (env) => {
            return getAccountIdsRelated(env, "USER", "COMMERCIAL");
        },
    })
    override billingAccountId?: string | undefined;
}