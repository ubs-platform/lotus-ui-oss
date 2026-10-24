# forms

This library was generated with [Nx](https://nx.dev).

## Billing days

`AdminSettingsForm.billingDays` accepts whole days from 1 through 28, including
both boundaries. An empty list disables scheduled billing for own-sales setups.
Do not use scalar min/max validators on the day array.

## Building

Run `nx build forms` to build the library.

## Running unit tests

Run `nx test forms` to execute the unit tests via [Jest](https://jestjs.io).
