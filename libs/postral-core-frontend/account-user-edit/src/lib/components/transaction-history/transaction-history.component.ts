import { Component, signal } from '@angular/core';
import {
  AccountControllerService,
  ItemCrudService,
  ItemTaxControllerService,
  PaymentControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  PaymentTransactionSearchForm,
} from '@lotus/postral-core-frontend/forms';
import { AccountDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'libTransactionHistory',
  standalone: false,
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent {
  instruction = signal<FormEditInstruction | null>(null);
  selectedPage = signal<string>('information');
  itemId = signal<string>('');
  historySearchSide = signal<"" | "ADMIN" | "SELLER" | "CUSTOMER">("");
  reform = signal<Reform<PaymentTransactionSearchForm>>(new Reform(PaymentTransactionSearchForm));
  /**
   *
   */
  constructor(
    private itemService: ItemCrudService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private accountService: AccountControllerService,
    private itemTaxService: ItemTaxControllerService,
    private paymentService: PaymentControllerService
  ) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe((data) => {
      // console.log(data);
      if (data['admin']) {
        this.historySearchSide.set("ADMIN");
      } else if (data['seller']) {
        this.historySearchSide.set("SELLER");
      } else if (data['customer']) {
        this.historySearchSide.set("CUSTOMER");
      }

      this.reform().getParameterMap().set("historySide", this.historySearchSide());
    });
  }


  fetchAccountById(id: string) {
    return this.accountService.get(id).pipe(
      catchError((e: any, caught) => {
        console.error(`Failed to fetch account with id ${id}:`, e);
        return of({ name: 'Bilinmiyor ' + id, id } as any as AccountDTO); // Return a fallback account object with the ID as the name
      })
    );
  }
}
