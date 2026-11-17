// Domain model (plain types, no dependencies)
export * from "./model/xdraw-data";

// Pure algorithms operating on the domain model
export * from "./utils/color-utils";
export * from "./utils/xdraw-fill-utils";
export * from "./utils/xdraw-data-utils";
export * from "./utils/xdraw-selection-utils";
export * from "./utils/xdraw-binary-codec";
export * from "./utils/clone-utils";
export * from "./utils/data-delta-utils";
export * from "./utils/xdraw-shape-utils";
export * from "./utils/undo-redo-helper";

// Project state (layers, undo/redo, active document)
export * from "./state/layer-manager";
export * from "./state/data-holder";

// Canvas rendering
export * from "./rendering/data-rasterizer";
export * from "./rendering/content-buffer-backend";
export * from "./rendering/content-buffer-worker-messages";
export * from "./rendering/fallback-content-buffer-backend";
export * from "./rendering/local-content-buffer-backend";
export * from "./rendering/worker-content-buffer-backend";

// Pointer/keyboard interaction handling
export * from "./interaction/canvas-gesture-listeners";
export * from "./interaction/canvas-draw-tools";
export type { CanvasDrawToolHost } from "./interaction/tools/canvas-tool-host";

// User-configurable settings
export * from "./settings/xdraw-settings-config";

// Local persistence (autosave)
export * from "./persistence/xdraw-autosave-config";
export * from "./persistence/idb-store";

// UI-agnostic notifications (UI layer registers a toast-based notifier)
export * from "./notifications/xdraw-notifier";
