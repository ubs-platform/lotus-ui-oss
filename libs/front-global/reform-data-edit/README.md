# reform-data-edit

This library was generated with [Nx](https://nx.dev).

Set `saveButtonPosition="hidden"` for reactive filter forms that do not persist
data. The form remains visible without the save/action bar.

## Team selection before save

Set `onTeamSelected` on a `FormEditInstruction` to open
`TeamSelectionDialogComponent` after `beforeSave` and before `saveMethod`.
`teamSelectionRequired` (boolean or `(data) => boolean`, default `true`) decides
whether the dialog opens, and `teamSelectionDialog` sets its title/description.
The callback receives the dialog result and the data to save; mutate the data or
return a replacement. Cancelling the dialog aborts the save. The host must
provide `BasicOverlayService`.

```ts
teamSelectionRequired: (data) => !data.id,
onTeamSelected: (result, data) => {
  data.entityOwnershipGroupId = result.usePersonalInsteadTeam
    ? undefined
    : result.selectedTeamId;
},
```

## Running unit tests

Run `nx test reform-data-edit` to execute the unit tests.
