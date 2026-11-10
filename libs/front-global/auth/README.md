# front-global-auth

This library was generated with [Nx](https://nx.dev).

## Session persistence

The shared login dialog passes its "Remember me" checkbox to
`AuthManagementService.login(credentials, rememberMe)`. When checked, the token
is stored in `localStorage`; otherwise it is stored in `sessionStorage` for the
current tab's session. Browser session restoration can restore session storage.
The checkbox remains checked by default.

Saving a token clears the token from the other storage. Token reads prefer
`sessionStorage`, then fall back to `localStorage` (including existing logins).
Logout and invalid-session cleanup remove the token from both storages.
Direct calls to `login` or `saveToken` without a persistence argument retain
the previous persistent behavior.

## Running unit tests

Run `nx test front-global-auth` to execute the unit tests.
