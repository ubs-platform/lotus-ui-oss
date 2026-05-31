import {
    PaymentStatus,
    PaymentTransactionSearchDTO,
    ReportDateGrouping,
    ReportQueryDTO,
    ReportType,

} from '@tk-postral/payment-common';
import { minky, minkyRoot, RequiredValidator } from '@lotus/front-global/minky/core';
import { SearchFromStringifiedType } from '../types/search-from-stringified.type';
import { getAccountIdsRelated } from '../utils/get-account-ids-related.util';
import { Injector } from '@angular/core';
import { AuthManagementService } from '@lotus/front-global/auth';
import { map } from 'rxjs';

@minkyRoot()
export class ReportQueryForm
    implements ReportQueryDTO {
    @minky({
        disable: true,
        widthRatio: '50%',
    })
    id?: string | undefined;

    @minky({
        defaultValueConstructor: () => '',
        widthRatio: '50%',
    })
    name: string = "";

    @minky({
        defaultValueConstructor: () => '',
    })
    description?: string | undefined;

    @minky({
        defaultValueConstructor: () => '',
        inputType: 'select',
        widthRatio: '50%',
        validators: [new RequiredValidator()],
        selectItems: (env) => {
            return getAccountIdsRelated(env, "USER", "COMMERCIAL");
        },
    })
    ownerAccountId?: string | undefined;

    @minky({
        defaultValueConstructor: () => '',
        inputType: 'select',
        widthRatio: '50%',
        validators: [new RequiredValidator()],
        selectItems: (env) => {
            return [{ text: 'Türk Lirası (₺)', value: 'TRY' }, { text: 'ABD Doları ($)', value: 'USD' }, { text: 'Euro (€)', value: 'EUR' }];
        },
    })
    currency?: string | undefined;

    @minky({
        inputType: 'select',
        label: "Rapor tarih gruplaması",
        defaultValueConstructor: () => "DAILY" as ReportDateGrouping,
        selectItems: () => {
            return [
                { text: 'Günlük', value: "DAILY" as ReportDateGrouping },
                { text: 'Haftalık', value: "WEEKLY" as ReportDateGrouping },
                { text: 'Aylık', value: "MONTHLY" as ReportDateGrouping },
                { text: 'Yıllık', value: "YEARLY" as ReportDateGrouping },
                { text: 'Tümü', value: "ALL" as ReportDateGrouping },
            ];
        }
    })
    dateGrouping: ReportDateGrouping = "DAILY";


    @minky({
        inputType: "select",
        defaultValueConstructor: () => "SELLER" as ReportType,
        selectItems: (appEnv) => {
            const ngInjector = appEnv.app?.['injector'] as Injector;
            return ngInjector.get(AuthManagementService).hasRole("ADMIN").pipe(map((isAdmin) => {
                if (isAdmin) {
                    return [
                        { text: 'Satıcı', value: "SELLER" as ReportType },
                        { text: 'Platform ciro', value: "PLATFORM" as ReportType },
                        { text: 'Platform-Satıcı (Günlük)', value: "PLATFORM_SELLER" as ReportType },
                        { text: 'Platform tüm akış', value: "PLATFORM_FLOW" as ReportType },
                    ];
                } else {
                    return [
                        { text: 'Satıcı', value: "SELLER" as ReportType },
                    ];
                }
            }))

        }
    })
    reportType: ReportType = "SELLER";

    @minky({
        disable: true,
        widthRatio: '50%',
    })
    createdAt?: string | Date | undefined;

    @minky({
        disable: true,
        widthRatio: '50%',
    })
    updatedAt?: string | Date | undefined;



}
