# reports

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test reports` to execute the unit tests.

## Report detail: platforms and ID-less items

SELLER and PLATFORM_FLOW report details display the backend's `platforms`
breakdown. Native payments are labeled "Postral (direct)" using the shared
`POSTRAL_INSTANCE` key; external sources show their name and platform code.
Order counts are separate from item quantities, with refunds shown separately.
Amounts use the report currency. Net sales subtract refunds; platform net revenue
also excludes net tax, but does not subtract commissions or other expenses.
PLATFORM and PLATFORM_SELLER remain commission reports, not platform-sales reports.

Historical platform breakdowns require the existing reconstruct-report action.
The UI explicitly notes this because newly digested payments alone do not make
an old report's platform totals complete. Missing platform arrays from older API
responses are supported without presenting them as zero sales.

Expense labels distinguish Postral commissions from each external platform's
commission total and item-class detail. External platform/class key segments
are URI-decoded before translation. Overall report expenses still include all
sources; this presentation does not change commission billing. Reconstruct
historical reports to split previously combined commission rows.

Items identified by name instead of a catalog ID show `(no id)` after their name.
Name normalization and grouping happen in Postral, not in the browser. Existing
variation labels remain visible; empty variations do not render empty parentheses.
Reconstruction is also required to separate ID-less products that old backend
versions merged into a single aggregate.

Focused rendering tests:
`nx test reports --testFile=libs/postral-core-frontend/reports/src/lib/report-info/report-info.component.spec.ts --runInBand`

## Seller report summary

`SellerReportSeriesComponent` is available at the seller settings
`report-summary` route. It uses owned active commercial accounts, the shared
currency options, and existing daily/monthly/yearly report sources. One period
selector maps 7/15 days to daily, 1/3/6 months to monthly, and 1/2/4 years to
yearly sources. Each includes the current calendar period; gaps remain missing, not zero.
Multiple source queries require explicit selection.

The checkbox at the bottom of the filters sends `skipUnavailableReports=true`
to omit periods without reports from both charts and the table. It is off by
default. The selected calendar range stays unchanged; older reports are not
fetched to replace missing periods, and existing zero-amount reports remain visible.

When no source query exists, a creation link opens the existing report-query
form with the selected account, currency, and grouping prefilled. These remain
editable and normal backend authorization applies. Creation is explicit, not
automatic, and does not promise historical backfill. If a source already exists
but has no reports in the selected range, link to that source instead of
suggesting a duplicate.

Column, horizontal bar, and line charts display one selected monetary metric per
report, defaulting to gross sales; gross sales are also listed separately for
each report period. A 100% stacked chart shows net earnings, tax, and expenses
as shares of net sales (after refunds). The stacked chart uses the net-sales
amount as its 100% base, not gross sales. Reports are not summed and currencies
or groupings are not converted. Chart/metric changes are local; server filter
changes cancel stale requests. Account and report errors have retry actions.
Pending/failed digestion is shown explicitly. Customer mode does not initialize
this feature.

## Standard seller report setup

`ReportSetupWizardService` opens a reusable `Reform` dialog. New active,
non-external commercial accounts open it after successful creation in seller
mode. Existing accounts expose a manual action; the seller query list and
missing-source state of the report summary open the same dialog. Summary and
account-detail entry points fix the account; the query list allows choosing it.
Admin query lists and customer mode do not expose seller setup.

The initial currency is TRY (or the current summary currency). Daily is selected
and disabled because commission calculations require daily reports; monthly and
yearly default to selected. Currency filters sources without conversion.
Preview lists existing/missing sources. Saving uses the account report-setup API
to add only missing SELLER queries. It preserves custom duplicates and existing
queries, even if an optional period is unchecked. Setup does not backfill
historical sales, so the first reporting period may be incomplete.

Account, preview, and save failures have retry actions. Failed setup never
undoes account creation. Successful setup refreshes the originating report
screen. Platform report setup remains separate; the existing automatic daily
PLATFORM_SELLER source is still created by payment digestion.
