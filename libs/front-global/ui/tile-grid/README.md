# Tile grid

Import `TileGridComponent` and `TileGridItemComponent` from
`@lotus/front-global/ui/tile-grid`. Both are standalone.

The grid uses fixed 12rem square cells with a 0.75rem gap. It fits as many
columns as the container allows, wrapping remaining items onto subsequent rows
without stretching tiles to fill unused space.

Items use `size="normal"` (12rem by 12rem) or `size="wide"` (24.75rem by
12rem, including the gap between two cells). When the container cannot fit two
cells, wide items fall back to one square cell. Below 12rem, the single column
shrinks to the container width to avoid horizontal page overflow. Tile content
scrolls if it exceeds the fixed height instead of increasing the row height.

```html
<lotus-web-tile-grid>
  <lotus-web-tile-grid-item
    label="Orders"
    description="View seller orders"
    icon="receipt_long"
    routerLink="/orders"
    size="wide"
    tone="primary"
  />
  <lotus-web-tile-grid-item label="Summary">
    <p>Custom summary content goes here.</p>
  </lotus-web-tile-grid-item>
  <lotus-web-tile-grid-item
    label="Refresh"
    [action]="true"
    [disabled]="loading"
    (activated)="refresh()"
  />
</lotus-web-tile-grid>
```

`routerLink` renders a native link; otherwise `action` renders a native button,
and the default is a non-interactive content tile. `disabled` applies to action
buttons only. Do not nest interactive content inside link or button tiles.
Use a non-interactive tile for summaries containing their own controls.

Labels and descriptions are plain strings: translate them in the consuming
feature. Tones (`surface`, `primary`, `accent`) use the application's theme
variables. The components do not load data or manage roles.
