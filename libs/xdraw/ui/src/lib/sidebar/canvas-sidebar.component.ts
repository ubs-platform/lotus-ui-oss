import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked, viewChild } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import { OverlayPanelComponent } from "@lotus/front-global/overlay-panel";
import { XDrawSettingsConfig, type XDrawDataHolder } from "@lotus/xdraw/core";
import { APP_NATIVE_CONTROLLER_TOKEN } from "../app-native-controller";
import { XDrawDialogs } from "../dialogs/xdraw-dialogs.service";
import { RecentFilesDialogComponent } from "../recent-files-dialog/recent-files-dialog.component";
import { ColorPickerPanelComponent } from "./color-picker-panel.component";
import { ExportDialogComponent, type XDrawExportImageOptions } from "./export-dialog.component";
import { LayersPanelComponent } from "./layers-panel.component";
import { PenSettingsPanelComponent } from "./pen-settings-panel.component";
import { TextSettingsPanelComponent } from "./text-settings-panel.component";

type ToolMode = "pointer" | "selection" | "move" | "draw" | "text";
type DrawType = "pencil" | "line" | "rectangle" | "ellipse" | "erase" | "fill";

@Component({
    selector: "xdraw-canvas-sidebar",
    imports: [
        UbsTranslatorNgxModule,
        FrontGlobalButtonModule,
        OverlayPanelComponent,
        RecentFilesDialogComponent,
        ColorPickerPanelComponent,
        ExportDialogComponent,
        LayersPanelComponent,
        PenSettingsPanelComponent,
        TextSettingsPanelComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./canvas-sidebar.component.html",
    styleUrl: "./canvas-sidebar.component.scss",
})
export class CanvasSidebarComponent {
    readonly holder = input.required<XDrawDataHolder>();
    readonly canUndo = input(false);
    readonly canRedo = input(false);

    readonly downloadProject = output<boolean>();
    readonly openProjectFromFile = output<void>();
    readonly saveAndShareProject = output<void>();
    readonly openRecentFile = output<string>();
    readonly exportImage = output<XDrawExportImageOptions>();
    readonly undo = output<void>();
    readonly redo = output<void>();
    readonly generateNew = output<void>();
    readonly flushAutosave = output<void>();

    protected readonly settings = inject(XDrawSettingsConfig);
    protected readonly appController = inject(APP_NATIVE_CONTROLLER_TOKEN);
    private readonly dialogs = inject(XDrawDialogs);

    protected readonly showExportDialog = signal(false);
    protected readonly showRecentFiles = signal(false);
    protected readonly copyrightYear = "2026";
    protected readonly canSaveToDevice = this.appController.isMobileApp || this.appController.isElectronApp;

    private readonly menuPanel = viewChild.required<OverlayPanelComponent>("menuPanel");
    private readonly penPanel = viewChild.required<OverlayPanelComponent>("penPanel");
    private readonly textPanel = viewChild.required<OverlayPanelComponent>("textPanel");
    private readonly colorPanel = viewChild.required<OverlayPanelComponent>("colorPanel");

    private colorDialogLastCommittedColor: string | null = null;

    constructor() {
        let colorPanelWasOpen = false;
        effect(() => {
            const open = this.colorPanel().show();
            if (colorPanelWasOpen && !open) {
                untracked(() => {
                    this.commitColorSelection();
                    this.colorDialogLastCommittedColor = null;
                });
            }
            colorPanelWasOpen = open;
        });
    }

    protected toolClass(active: boolean): string {
        return active ? "primary" : "surface";
    }

    protected isDrawType(drawType: DrawType): boolean {
        return this.settings.mode() === "draw" && this.settings.drawType() === drawType;
    }

    /** Aktif araca tekrar basilinca ayar paneli acilir; aksi halde arac secilir. */
    protected selectMode(mode: ToolMode, anchor: HTMLElement): void {
        if (this.settings.mode() === mode) {
            if (mode === "pointer") this.penPanel().showDialog(anchor, "DOWN");
            if (mode === "text") this.textPanel().showDialog(anchor, "DOWN");
            return;
        }
        this.settings.mode.set(mode);
    }

    protected selectDrawType(drawType: DrawType, anchor: HTMLElement, hasSettings = true): void {
        if (hasSettings && this.isDrawType(drawType)) {
            this.penPanel().showDialog(anchor, "DOWN");
            return;
        }
        this.settings.mode.set("draw");
        this.settings.drawType.set(drawType);
    }

    protected cycleBackgroundPattern(): void {
        this.settings.backgroundPatternMode.update((mode) => ((mode + 1) % 3) as 0 | 1 | 2);
    }

    protected openColorPicker(anchor: HTMLElement): void {
        this.colorDialogLastCommittedColor = this.settings.strokeColor();
        this.colorPanel().showDialog(anchor, "RIGHT");
    }

    protected pickRecentColor(color: string, anchor: HTMLElement): void {
        if (this.settings.strokeColor() === color) {
            this.openColorPicker(anchor);
            return;
        }
        this.settings.strokeColor.set(color);
    }

    protected commitColorSelection(): void {
        const currentColor = this.settings.strokeColor();
        const previousColor = this.colorDialogLastCommittedColor;
        if (!previousColor || previousColor === currentColor) {
            this.colorDialogLastCommittedColor = currentColor;
            return;
        }
        this.settings.recentColors.set(
            [
                currentColor,
                previousColor,
                ...this.settings.recentColors().filter((color) => color !== previousColor && color !== currentColor),
            ].slice(0, 30),
        );
        this.colorDialogLastCommittedColor = currentColor;
    }

    protected closeMenu(): void {
        this.menuPanel().hideDialog();
    }

    protected openExportDialog(): void {
        this.menuPanel().hideDialog();
        this.showExportDialog.set(true);
    }

    protected openRecentFilesDialog(): void {
        this.menuPanel().hideDialog();
        this.showRecentFiles.set(true);
    }

    protected async toggleTheme(): Promise<void> {
        const nextTheme = this.settings.appTheme() === "light" ? "dark" : "light";
        const invertLightness = this.settings.invertLightness();
        const shouldAskAboutInvertLightness =
            (nextTheme === "dark" && !invertLightness) || (nextTheme === "light" && invertLightness);
        if (!shouldAskAboutInvertLightness) {
            this.settings.appTheme.set(nextTheme);
            return;
        }
        const confirmed = await this.dialogs.confirm(`xdraw.invert-lightness-on-${nextTheme}-confirm`);
        this.settings.appTheme.set(nextTheme);
        if (confirmed) {
            this.settings.invertLightness.set(nextTheme === "dark");
        }
    }
}
