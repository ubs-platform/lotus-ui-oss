# Card

Standalone `CardComponent` (`lotus-web-card`), imported from `@lotus/front-global/card`.
A clickable tile with a cover image, a title and an optional badge. Book cards in
Lotus and app cards in the tkfn homepage are built on it.

```html
<lotus-web-card
  [imageUrl]="'/api/file/BOOK_THUMB/' + id"
  [title]="name"
  badge="Komünite kitabı"
  (selected)="open()" />

<lotus-web-card [skeleton]="true" />
```

- `imageUrl`: cover; when it fails to load, `/assets/not-found.image.png` is shown.
- `appendWidth`: appends `?width=<rendered width>` so the file service can resize the image.
- `badge`: small pill under the title; omitted when empty.
- `skeleton`: placeholder shown while data loads.
- `selected`: emitted on click, Enter and Space. The card has no navigation logic of its own.

Colors come from the app's CSS variables (`--bg-1`, `--fg`, `--border-color`,
`--primary-color-bg-hover`, ...).

Run `nx test front-global-card` and `nx lint front-global-card`.
