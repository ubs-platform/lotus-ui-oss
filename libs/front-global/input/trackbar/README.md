# trackbar

Standalone, theme-aware range input exported as `TrackbarComponent`.

```html
<lib-trackbar [(value)]="amount" [minValue]="0" [maxValue]="100" [step]="1" />
```

The filled track follows `value` and the configured bounds. Mouse, touch and
keyboard interactions use the native range input. Chrome/Safari and Firefox
have custom track and thumb styles, with a visible keyboard focus outline.

Styles are scoped to the component rather than all global range inputs.
Colors follow the application theme (`--primary-color`, `--bg-1`,
`--bg-surface`). Override `--trackbar-color`, `--trackbar-track-color` or
`--trackbar-thumb-color` on `lib-trackbar` for a local variant.

## Running unit tests

Run `nx test trackbar` to execute the unit tests.
