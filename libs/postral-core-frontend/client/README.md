# client

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test client` to execute the unit tests.

`AccountControllerService.previewReportSetup()` and `setupReports()` call
`/service/payment/api/account/:accountId/report-setup` (GET/POST). Keep the
`/api` segment: the application payment proxy strips only `/service/payment`.
Contracts are exported by `@tk-postral/payment-common` and must be patched from
the owning Postral repository after changes.

`PlatformSetupClientService` calls `/service/payment/api/platform-setup`.
The read-only status endpoint and POST steps (`team`, `platform-account`,
`settings`, `seller-account`, `complete`, `keep-existing`) use the shared
`PlatformSetup*DTO` contracts. Setup progress is server-owned; do not infer
completion from a billing-settings row or store a completion flag locally.
The admin feature owns guards and the resumable Reform page, not this client.
Completion optionally accepts `PlatformSetupCompleteDTO.paymentChannelIds`;
omitting it preserves the existing behavior of creating no channels.
