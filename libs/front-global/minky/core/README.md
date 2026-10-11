# @ubs-platform/minky

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test @ubs-platform/minky` to execute the unit tests.

## Initial value callbacks

Opt in per field to run its `onValueChange` callback for an existing initial value:

```ts
@minky({
  emitInitialValueChange: true,
  onValueChange: (value, oldValue, environment) => {
    environment.state.setDisabled?.('dependentField', value === '');
  },
})
sourceField!: string;
```

Callbacks run synchronously on the first `generateInputCarriers()` call, before
carriers are built, rather than in the constructor. Set the application environment
and parameters before generating carriers. Nested objects and existing array items
are included, including hidden fields. Missing, `null`, `undefined`, and file values
are skipped; `false`, `0`, and empty strings are included. Fallback-construction
values also qualify.

Both callback arguments receive the field's value at initialization. A return value
other than `undefined` replaces the field value, just as with regular input changes.
Replacement values are applied through `setValueByPath`. Each initialized callback
publishes `valueUpdate`, including callbacks that return `undefined`.
Initialization does not mark fields touched or change the saved `initialValue`.
Repeated carrier generation does not rerun callbacks. `reset()` and `resetToValue()`
allow callbacks to run again on the next carrier generation.

Without `emitInitialValueChange: true`, initialization behavior is unchanged.
