# forms

This library was generated with [Nx](https://nx.dev).

## Billing days

`AdminSettingsForm.billingDays` accepts whole days from 1 through 28, including
both boundaries. An empty list disables scheduled billing for own-sales setups.
Do not use scalar min/max validators on the day array.

## Item catalog details

`ItemForm` exposes `isPhysical` as a checkbox (default false) and the optional
`metaEntityGroup`, `metaEntityName`, `metaEntityId` catalog references. Different
sellers may reuse the same meta reference; it is not the item's own entity
identity. The standard item editor saves these through the shared item client.
Payment snapshots retain the values at purchase time. In the iyzico sandbox,
physical baskets use the payment's selected billing-address snapshot for
shipping, falling back to the customer's default address during payment init.

## Building

Run `nx build forms` to build the library.

## Running unit tests

Run `nx test forms` to execute the unit tests via [Jest](https://jestjs.io).
