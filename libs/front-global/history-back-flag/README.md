# history-back-flag

Dependency-free helpers that tie dialogs and paged views to the browser back button
(`generateMobileOptimizedDialogHideController`, `DialogVisibilityReference`, `DialogInformation`, ...).

Keep this library free of imports from other workspace UI libraries (button, webdialog,
prompt-overlays): `ubs-touch-ngx` depends on it, and importing back would reintroduce a circular dependency.
