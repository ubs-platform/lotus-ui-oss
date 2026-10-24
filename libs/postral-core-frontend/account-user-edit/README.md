# account-user-edit

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test account-user-edit` to execute the unit tests.

`ItemPriceListComponent.pricesChanged` emits after successfully saving or deleting
a price so consumers can refresh their price-readiness checks.

The seller-only `report-summary` menu opens the report charts from the reports
library. Customer mode hides the menu and does not load report/account data.

After creating an active, non-external commercial account in seller mode, the
saved account detail opens the standard sales-report setup dialog. Daily is
mandatory; monthly/yearly default to selected and currency defaults to TRY.
The same dialog is available from account detail without saving the account
again. Skipping or failing report setup preserves the account. Individual,
external, deactivated accounts and customer mode do not expose this action.

## Experimental external sales

Seller orders (`transaction/history`) offers an **under construction** external
sale form at `transaction/external-platform`. It uses `Reform` with nested
customer/address inputs and repeatable line items. The seller chooses an owned
commercial account with a default address and an active external platform.
Customer mode does not expose the action or initialize the form.

Saving confirms the gross total and calls
`PaymentControllerService.createExternalPlatformPayment` through
`/service/payment/api/payment/external-platform`. This records a completed sale
already collected elsewhere, not a new payment-channel charge. Success returns
to seller orders; errors preserve the form. Repeated platform/order references
are rejected by the backend. If completion fails after persistence, the backend
returns the saved payment ID and requires administrator reconciliation; do not
create the order again.

Payment and seller-order details explain that external refunds are not supported
yet and must be handled on the external platform. Normal refund actions remain
available for normal payments.

External sales show an orange **Dış platform** badge in payment and seller-order
lists and details when `externalPlatformId` is present. Seller-order read endpoints
include this metadata from the parent payment using a batched lookup.

The spec configuration uses bundler resolution for Angular package exports and
isolated transpilation for the Jest preset; run the Angular build or `tsc` for
type checking alongside focused tests.
