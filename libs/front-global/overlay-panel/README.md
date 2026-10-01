# overlay-panel

This library was generated with [Nx](https://nx.dev).

## Tooltip

Import `PTooltipDirective` from `@lotus/front-global/overlay-panel` in a standalone component's `imports` or an NgModule's `imports`, then use `pTooltip` on any element:

```html
<span pTooltip="Details">Hover or focus me</span>
<button [pTooltip]="tooltipText">Action</button>
```

Empty values do not open a tooltip. Text is translated with the workspace `translate` pipe. When migrating a template from PrimeNG, remove its `TooltipModule` import before adding `PTooltipDirective` to the same compilation scope.

## Running unit tests

Run `nx test overlay-panel` to execute the unit tests.
