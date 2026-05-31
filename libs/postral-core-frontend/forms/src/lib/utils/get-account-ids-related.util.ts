import { Injector } from '@angular/core';
import { AccountControllerService } from '@lotus/postral-core-frontend/client';
import { map } from 'rxjs';

export function getAccountIdsRelated(
  env: any,
  fieldPaymentSide: 'SELLER' | 'CUSTOMER' | 'USER' | 'ADMIN' = 'USER',
  accountType: 'INDIVIDUAL' | 'COMMERCIAL' | undefined = undefined
) {
  const accountService = (env.app?.['injector'] as Injector).get(
    AccountControllerService
  );

  if (fieldPaymentSide === 'CUSTOMER') {
    return accountService.paymentRelatedAccounts({
        selectFrom: "TARGET",
        filterRelatedAccountIdsIn: "SOURCE"
    }).pipe(
      map((accounts) =>
        accounts.map((account) => ({
          value: account.id!,
          text: account.name,
        }))
      )
    );
  }

  if (fieldPaymentSide === 'SELLER') {
    return accountService.paymentRelatedAccounts(
      {
        selectFrom: "SOURCE",
        filterRelatedAccountIdsIn: "TARGET"
      }
    ).pipe(
      map((accounts) =>
        accounts.map((account) => ({
          value: account.id!,
          text: account.name,
        }))
      )
    );
  }

  if (fieldPaymentSide === 'ADMIN' || fieldPaymentSide === 'USER') {
    return accountService
      .getAll({ admin: fieldPaymentSide === 'ADMIN' ? 'true' : 'false', type: accountType })
      .pipe(
        map((accounts) =>
          accounts.map((account) => ({
            value: account.id!,
            text: account.name,
          }))
        )
      );
  }

  return [];
}
