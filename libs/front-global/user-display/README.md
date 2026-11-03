# User display

Standalone `UserDisplayComponent`, imported from `@lotus/front-global/user-display`.
Displays a 50px profile photo, name/surname and optional username.

```html
<lotus-web-user-display [user]="user" />
<lotus-web-user-display [user]="null" missingState="anonymous" />
<lotus-web-user-display [user]="null" missingState="deleted" />
```

`user` accepts a structural `UserDisplayInfo` with optional `id` or `userId`,
`name`, `surname` and `username`. This supports both user and gift-sender DTOs
without coupling the component to either feature. `showUsername` defaults to
true; set it to false when the username already has its own table column.
If there is no full name, the username is used as the primary label.

Null/undefined users default to "Anonim"; callers must explicitly choose
`missingState="deleted"` when they know the account was deleted. Absence of
an image or ID does not imply account deletion. Failed profile photos display
initials instead. The component never fetches user identity; a null user never
causes a profile-photo request. Anonymous callers must pass null, not hidden
identity fields.

Set `showIdentity` to false for an avatar-only display (the accessible name is
preserved). Set the CSS custom property `--user-avatar-size` to resize both the
photo and the initials fallback. The application header uses this for its
compact account button and larger account-menu avatar. Photo errors, including
HTTP 404, activate the fallback without a separate existence request.

Run `nx test front-global-user-display` and `nx lint front-global-user-display`.
