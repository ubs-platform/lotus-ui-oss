import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { ColorUtils, XDrawSettingsConfig } from "@lotus/xdraw/core";
import { LabeledTrackbarComponent } from "../shared/labeled-trackbar.component";

const COLOR_PRESETS = [
    "#000000", "#FFFFFF", "#EF4444", "#F59E0B", "#EAB308", "#22C55E",
    "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#92400E",
];
const ALPHA_PRESETS = [1, 0.8, 0.6, 0.4, 0.2, 0.1];

/** Renk secici paneli. Kullanici bir secimi tamamladiginda `commit` yayar (son renkler listesi icin). */
@Component({
    selector: "xdraw-color-picker-panel",
    imports: [UbsTranslatorNgxModule, LabeledTrackbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./color-picker-panel.component.html",
    styleUrl: "./color-picker-panel.component.scss",
})
export class ColorPickerPanelComponent {
    protected readonly settings = inject(XDrawSettingsConfig);
    readonly commit = output<void>();

    protected readonly colorPresets = COLOR_PRESETS;
    protected readonly alphaPresets = ALPHA_PRESETS;

    protected readonly colorRgb = computed(
        () => ColorUtils.hexToRgb(this.settings.strokeColor()) ?? { r: 0, g: 0, b: 0 },
    );
    protected readonly colorHsl = computed(() => {
        const hsl = ColorUtils.hexToHsl(this.settings.strokeColor());
        return hsl
            ? { h: Math.round(hsl.h), s: Math.round(hsl.s), l: Math.round(hsl.l) }
            : { h: 0, s: 0, l: 0 };
    });
    protected readonly hueTrackStyle = computed(() => {
        const { s, l } = this.colorHsl();
        const hues = [0, 60, 120, 180, 240, 300, 360];
        return `linear-gradient(90deg, ${hues.map((hue) => `hsl(${hue} ${s}% ${l}%)`).join(", ")})`;
    });

    protected applyColor(color: string): void {
        this.settings.strokeColor.set(color);
    }

    protected onColorInput(event: Event): void {
        this.settings.strokeColor.set((event.target as HTMLInputElement).value);
    }

    protected setAlpha(alpha: number): void {
        this.settings.strokeAlpha.set(Number(Math.max(0, Math.min(1, alpha)).toFixed(2)));
    }

    protected setHsl(channel: "h" | "s" | "l", value: number): void {
        const next = { ...this.colorHsl(), [channel]: value };
        this.settings.strokeColor.set(ColorUtils.hslToHex(next.h, next.s, next.l));
    }

    protected setRgb(channel: "r" | "g" | "b", rawValue: number): void {
        const value = Number.isFinite(rawValue) ? Math.max(0, Math.min(255, Math.round(rawValue))) : 0;
        const next = { ...this.colorRgb(), [channel]: value };
        this.settings.strokeColor.set(ColorUtils.rgbToHex(next.r, next.g, next.b));
    }
}
