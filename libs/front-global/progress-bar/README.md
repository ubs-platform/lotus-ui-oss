# front-global-progress-bar

Reusable, accessible progress bar for front-global.

Import `FrontGlobalProgressBarModule` from `@lotus/front-global/progress-bar`
and provide a percentage value and accessible label:

```html
<lotus-web-progress-bar
  [value]="progressPercent()"
  ariaLabel="Sales readiness"
></lotus-web-progress-bar>
```

The value is clamped to the 0–100 range and used for both the fill width and
the progressbar's `aria-valuenow`.
