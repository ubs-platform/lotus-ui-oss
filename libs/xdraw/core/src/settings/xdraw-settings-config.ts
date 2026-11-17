import { Injectable, effect, signal, type Signal } from "@angular/core";

export const XDRAW_SETTING_KEYS = {
  appTheme: "xdraw.settings.appTheme",
  invertLightness: "xdraw.settings.invertLightness",
  mode: "xdraw.settings.mode",
  drawType: "xdraw.settings.drawType",
  strokeColor: "xdraw.settings.strokeColor",
  strokeAlpha: "xdraw.settings.strokeAlpha",
  recentColors: "xdraw.settings.recentColors",
  baseStrokeWidth: "xdraw.settings.baseStrokeWidth",
  eraserSize: "xdraw.settings.eraserSize",
  stylusModeEnabled: "xdraw.settings.stylusModeEnabled",
  pressureWidthEnabled: "xdraw.settings.pressureWidthEnabled",
  pressureSmoothing: "xdraw.settings.pressureSmoothing",
  minSegmentLength: "xdraw.settings.minSegmentLength",
  zoomDirection: "xdraw.settings.zoomDirection",
  scaleToolSizesWithZoom: "xdraw.settings.scaleToolSizesWithZoom",
  useWebWorker: "xdraw.settings.useWebWorker",
  autosaveSnapshot: "xdraw.settings.autosaveSnapshot",
  backgroundPatternMode: "xdraw.settings.backgroundPatternMode",
  textFontFamily: "xdraw.settings.textFontFamily",
  textFontSize: "xdraw.settings.textFontSize",
  textBold: "xdraw.settings.textBold",
} as const;

type Theme = "light" | "dark";
type Mode = "pointer" | "selection" | "move" | "draw" | "text";
type DrawType = "pencil" | "line" | "rectangle" | "ellipse" | "erase" | "fill";
type ZoomDirection = 1 | -1;
type BackgroundPatternMode = 0 | 1 | 2;

const persist = (key: string, value: unknown): void => {
  localStorage.setItem(key, String(value));
};

const read = (key: string) => localStorage.getItem(key);
const readNumber = (key: string, min: number, max: number) => {
  const raw = read(key);
  // Number(null) ve Number("") 0 verir; kayit yoksa varsayilan degerin kullanilmasi icin null donulur.
  if (raw === null || raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max
    ? value
    : null;
};
const readBoolean = (key: string) => {
  const value = read(key);
  return value === "true" ? true : value === "false" ? false : null;
};

@Injectable({ providedIn: "root" })
export class XDrawSettingsConfig {
  appTheme = signal<Theme>(read(XDRAW_SETTING_KEYS.appTheme) === "dark" ? "dark" : "light");
  invertLightness = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.invertLightness) ?? false);
  mode = signal<Mode>(
    read(XDRAW_SETTING_KEYS.mode) === "draw"
      ? "draw"
      : read(XDRAW_SETTING_KEYS.mode) === "text"
        ? "text"
        : read(XDRAW_SETTING_KEYS.mode) === "selection"
          ? "selection"
          : read(XDRAW_SETTING_KEYS.mode) === "move"
            ? "move"
          : "pointer",
  );
  drawType = signal<DrawType>(read(XDRAW_SETTING_KEYS.drawType) as any || "pencil");
  strokeColor = signal<string>(read(XDRAW_SETTING_KEYS.strokeColor) || "#000000");
  strokeAlpha = signal<number>(readNumber(XDRAW_SETTING_KEYS.strokeAlpha, 0, 1) ?? 1);
  recentColors = signal<string[]>(JSON.parse(read(XDRAW_SETTING_KEYS.recentColors) || "[]"));
  baseStrokeWidth = signal<number>(readNumber(XDRAW_SETTING_KEYS.baseStrokeWidth, 1, 100) ?? 5);
  eraserSize = signal<number>(readNumber(XDRAW_SETTING_KEYS.eraserSize, 1, 100) ?? 10);
  stylusModeEnabled = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.stylusModeEnabled) ?? false);
  pressureWidthEnabled = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.pressureWidthEnabled) ?? true);
  pressureSmoothing = signal<number>(readNumber(XDRAW_SETTING_KEYS.pressureSmoothing, 0, 1) ?? 0.5);
  minSegmentLength = signal<number>(readNumber(XDRAW_SETTING_KEYS.minSegmentLength, 0, 100) ?? 1);
  zoomDirection = signal<ZoomDirection>(readNumber(XDRAW_SETTING_KEYS.zoomDirection, -1, 1) === -1 ? -1 : 1);
  scaleToolSizesWithZoom = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.scaleToolSizesWithZoom) ?? true);
  useWebWorker = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.useWebWorker) ?? true);
  backgroundPatternMode = signal<BackgroundPatternMode>(readNumber(XDRAW_SETTING_KEYS.backgroundPatternMode, 0, 2) as any ?? 0);
  textFontFamily = signal<string>(read(XDRAW_SETTING_KEYS.textFontFamily) || "system-ui");
  textFontSize = signal<number>(readNumber(XDRAW_SETTING_KEYS.textFontSize, 8, 120) ?? 16);
  textBold = signal<boolean>(readBoolean(XDRAW_SETTING_KEYS.textBold) ?? false);

  constructor() {
    const persisted: Array<[string, Signal<unknown>, (value: unknown) => string]> = [
      [XDRAW_SETTING_KEYS.appTheme, this.appTheme, String],
      [XDRAW_SETTING_KEYS.invertLightness, this.invertLightness, String],
      [XDRAW_SETTING_KEYS.mode, this.mode, String],
      [XDRAW_SETTING_KEYS.drawType, this.drawType, String],
      [XDRAW_SETTING_KEYS.strokeColor, this.strokeColor, String],
      [XDRAW_SETTING_KEYS.strokeAlpha, this.strokeAlpha, String],
      [XDRAW_SETTING_KEYS.recentColors, this.recentColors, (value) => JSON.stringify(value)],
      [XDRAW_SETTING_KEYS.baseStrokeWidth, this.baseStrokeWidth, String],
      [XDRAW_SETTING_KEYS.eraserSize, this.eraserSize, String],
      [XDRAW_SETTING_KEYS.stylusModeEnabled, this.stylusModeEnabled, String],
      [XDRAW_SETTING_KEYS.pressureWidthEnabled, this.pressureWidthEnabled, String],
      [XDRAW_SETTING_KEYS.pressureSmoothing, this.pressureSmoothing, String],
      [XDRAW_SETTING_KEYS.minSegmentLength, this.minSegmentLength, String],
      [XDRAW_SETTING_KEYS.zoomDirection, this.zoomDirection, String],
      [XDRAW_SETTING_KEYS.scaleToolSizesWithZoom, this.scaleToolSizesWithZoom, String],
      [XDRAW_SETTING_KEYS.useWebWorker, this.useWebWorker, String],
      [XDRAW_SETTING_KEYS.backgroundPatternMode, this.backgroundPatternMode, String],
      [XDRAW_SETTING_KEYS.textFontFamily, this.textFontFamily, String],
      [XDRAW_SETTING_KEYS.textFontSize, this.textFontSize, String],
      [XDRAW_SETTING_KEYS.textBold, this.textBold, String],
    ];
    for (const [key, setting, serialize] of persisted) {
      effect(() => persist(key, serialize(setting())));
    }
  }
}
