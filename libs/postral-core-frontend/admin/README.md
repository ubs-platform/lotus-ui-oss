# admin

This library was generated with [Nx](https://nx.dev).

## Homepage

The homepage presents seller shortcuts and an additional management section for
`ADMIN` / `POSTRAL_ADMIN` users. The management section remains hidden while
roles load. Menu visibility does not replace backend authorization.

Tiles use `@lotus/front-global/ui/tile-grid` and translations under
`postral.home`. The seller homepage loads pending refund and report summaries;
the reports tile uses custom template content and rotates through report
summaries every five seconds. No financial calculations are performed.
Existing sidebar navigation and routes remain unchanged.

## Routing and logout

Load `PostralCoreAdminModule` only through the application's `/admin` lazy route.
Do not also import it in the root module: its empty-path frame and wildcard child
would be registered at the root and could capture `/login`.

The frame redirects to `/login` when authentication is cleared and stops listening
when destroyed. Postral's shared header also uses `logoutRedirectUrl="/login"` so
its post-logout navigation does not cancel the frame's redirect.

## First-run platform setup

Postral routes administrators with unfinished backend setup to `/admin/setup`.
Regular sellers keep their shared homepage and do not call the setup API.
`ADMIN`, `POSTRAL-ADMIN` and the existing `POSTRAL_ADMIN` alias are recognized.
Status/permission failures are surfaced, never treated as completed setup.

The standalone setup page uses `ReformDataEditComponent` with Reform models;
it reuses `AddressForm`, its CSCD-to-UBL mapping, and `AccountForm` rather than
duplicating their business fields. Address and account are entered consecutively
and saved together. The optional marketplace seller can reuse the platform
address, but always receives its own account. Country defaults to TR, currency
to TRY, report periods to daily/monthly/yearly, billing days to 1/28 and
commission-service tax to 20%. Daily is selected and disabled. Billing days use
inclusive integer validation (1–28), including in the ordinary settings form.

Both operating models include an add/remove Reform array for additional taxes
in the settings step, with a name and whole percentage per row. It starts with
KDV 0/1/10/20 presets; all rows can be removed. The review shows the saved
selection. Backend provisioning gives each tax one DEFAULT variation and private
administration-team ownership; these are separate from the commission-service
tax and are not automatically assigned to products. Saved rows, like the other
setup settings, cannot be edited after the step is committed. Older in-progress
setups without this list and existing completed installations are unchanged.

The final review includes an optional, initially unchecked Reform checkbox for
`dummy-ecommerce`. Selected missing channels are created by backend completion
in the same transaction, enabled with `devOnly: false`. Existing channel records
are not changed or re-enabled. This is a test channel, not a real payment
provider: the review and payment-channel list/edit pages warn to set
`devOnly: true` or disable it before production. Adding other providers later
requires backend allowlisting and provider integration, not just a new checkbox.

The backend owns progress and completion. Refresh resumes the last saved step;
unsaved fields in the current step are not stored in browser persistence.
An interrupted ownership assignment displays a repair action without collecting
private account data again or creating another account. Complete the setup using
the administrator who started it. Existing installations offer explicit
configuration adoption instead of creating a replacement platform. Saved setup
choices cannot be edited in this first-run flow; normal administration remains
the place for subsequent changes. There is no first-run reset setting.

TR/EN/DE strings live under `postral.platform-setup`. HTTP-only setup clients
are in the client library; route guards stay here to avoid adding auth/overlay
dependency cycles to the client barrel. Focused aliases in the base TypeScript
configuration expose lightweight service/constant/guard entry points without
loading their library barrels. The application's entry guard uses the
`admin/setup-guards` entry point, not the lazy admin module.

Focused validation: `nx test admin --runInBand --testPathPatterns=platform-setup`.

## Running unit tests

Run `nx test admin` to execute the unit tests.
