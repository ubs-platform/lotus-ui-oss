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
import { currencyOptions, reportDateGroupingOptions, reportTypeOptionsAll, reportTypeOptionsSellerOnly } from '../forms';

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
            return currencyOptions;
        },
    })
    currency?: string | undefined;

    @minky({
        inputType: 'select',
        label: "Rapor tarih gruplaması",
        defaultValueConstructor: () => "DAILY" as ReportDateGrouping,
        selectItems: () => {
            return reportDateGroupingOptions;
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
                    return reportTypeOptionsAll;
                } else {
                    return reportTypeOptionsSellerOnly;
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
