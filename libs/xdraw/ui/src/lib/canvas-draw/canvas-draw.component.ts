import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    signal,
    untracked,
    viewChild,
} from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import {
    CanvasDrawTools,
    ColorUtils,
    listenKey,
    listenPinch,
    XDrawDataHolder,
    XDrawSettingsConfig,
    xdrawBuffersEqual,
    xdrawSkeletonsEqual,
    type CanvasDrawToolHost,
    type XDrawHistorySnapshot,
    type XDrawSnapshot,
} from "@lotus/xdraw/core";
import { APP_NATIVE_CONTROLLER_TOKEN } from "../app-native-controller";
import { XDrawDialogs } from "../dialogs/xdraw-dialogs.service";
import { CanvasSidebarComponent } from "../sidebar/canvas-sidebar.component";
import type { XDrawExportImageOptions } from "../sidebar/export-dialog.component";
import { isValidViewport, XDrawAutosave, type XDrawViewport } from "./xdraw-autosave";

interface ProjectPayload {
    snapshot: XDrawSnapshot;
    viewport?: XDrawViewport;
}

// Kamera olcek siniri; asiri yakinlasma/uzaklasmayi engeller.
const MIN_SCALE = 0.05;
const MAX_SCALE = 40;
// Kalem kalkinca hemen commit etmek yerine bekletiyoruz; bu sure icinde yeni bir
// stroke baslarsa ayni undo adimina devam eder ve agir JSON islemleri hic calismaz.
const GESTURE_FINALIZE_DELAY_MS = 500;
const CONTROLS_FADE_DELAY_MS = 5000;
const LONG_PRESS_MS = 550;
const PROJECT_FILE_NAME = "xdraw_project.xdraw.json";

/**
 * Cizim sayfasi. Canvas Angular tarafindan yeniden olusturulmaz; pointer/klavye olaylari change detection
 * tetiklememek icin elle dinlenir ve sadece UI'da gorunen degerler signal olarak tutulur.
 */
@Component({
    selector: "xdraw-canvas-draw",
    imports: [CanvasSidebarComponent, FrontGlobalButtonModule, UbsTranslatorNgxModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./canvas-draw.component.html",
    styleUrl: "./canvas-draw.component.scss",
})
export class CanvasDrawComponent implements CanvasDrawToolHost {
    readonly settings = inject(XDrawSettingsConfig);
    private readonly appController = inject(APP_NATIVE_CONTROLLER_TOKEN);
    private readonly dialogs = inject(XDrawDialogs);
    private readonly destroyRef = inject(DestroyRef);

    readonly worldX = signal(0);
    readonly worldY = signal(0);
    readonly zoomFactor = signal(1);
    readonly clickedCameraX = signal(0);
    readonly clickedCameraY = signal(0);
    protected readonly worldXUI = computed(() => Math.round(this.worldX()));
    protected readonly worldYUI = computed(() => Math.round(this.worldY()));
    protected readonly zoomFactorUI = computed(() => Math.round(this.zoomFactor()));

    smoothedPressure: number | null = null;
    lastDrawPoint: { x: number; y: number } | null = null;
    lastErasePoint: { x: number; y: number } | null = null;
    readonly svgHolder = new XDrawDataHolder();
    private readonly undoRedoHelper = this.svgHolder.undoRedoHelper;
    private readonly drawTools = new CanvasDrawTools(this);
    private readonly autosave = new XDrawAutosave(() => ({
        snapshot: this.svgHolder.captureDrawingSnapshotForPersistence(),
        viewport: this.currentViewport(),
        savedAt: new Date().toISOString(),
    }));

    protected readonly canUndo = signal(false);
    protected readonly canRedo = signal(false);
    protected readonly menusDimmed = signal(false);
    private readonly pointerBusy = signal(false);
    protected readonly showPasteMenu = signal(false);
    protected readonly pasteMenuX = signal(0);
    protected readonly pasteMenuY = signal(0);
    private readonly selectionActionsDismissed = signal(false);
    protected readonly hasSelection = computed(() => this.svgHolder.selectedElementCount() > 0);
    protected readonly clipboardAvailable = computed(() => this.svgHolder.clipboardAvailable());
    protected readonly showSelectionActions = computed(() => {
        const mode = this.settings.mode();
        return (
            this.hasSelection() &&
            !this.pointerBusy() &&
            !this.showPasteMenu() &&
            mode !== "draw" &&
            mode !== "text" &&
            !this.selectionActionsDismissed()
        );
    });

    protected readonly gridStyle = computed(() => {
        const x = this.worldX();
        const y = this.worldY();
        const zoom = this.zoomFactor();
        const gridSize = 20 * zoom;
        const majorSize = 100 * zoom;
        const offset = (world: number, size: number): string => `${-(world * zoom) % size}px`;
        return {
            "--gridSize": `${gridSize}px ${gridSize}px`,
            "--gridMajorSize": `${majorSize}px ${majorSize}px`,
            "--gridOffset": `${offset(x, gridSize)} ${offset(y, gridSize)}`,
            "--gridMajorOffset": `${offset(x, majorSize)} ${offset(y, majorSize)}`,
            "--lineWidth": `${zoom}px`,
        };
    });
    protected readonly gridClass = computed(() => {
        const mode = this.settings.backgroundPatternMode();
        const zoom = this.zoomFactor();
        if (mode === 0) {
            return "xdraw-grid-off";
        }
        // 20px'lik grid cizgileri 4px'in altina indiginde (zoom < 0.2) moire/titreme olmamasi icin
        // izgarayi solid gri tona donusturuyoruz.
        if (zoom < 0.2) {
            // Cetvel/kademeli modda iken 100'luk ana cizgiler hala gorunur olsun
            return mode === 2 && zoom >= 0.07 ? "xdraw-grid-ruler-far" : "xdraw-grid-solid";
        }
        return mode === 1 ? "xdraw-grid-lines" : "xdraw-grid-ruler";
    });

    private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");
    private readonly viewportRef = viewChild.required<ElementRef<HTMLDivElement>>("canvasViewport");
    private readonly surfaceRef = viewChild.required<ElementRef<HTMLDivElement>>("surface");

    private canvasWidth = 800;
    private canvasHeight = 600;
    private canvasCursor = "crosshair";
    private isPointerDragging = false;
    private activePointerId: number | null = null;
    private readonly activePointers = new Map<number, { x: number; y: number }>();
    private lastPinchDistance = 0;
    private pasteWorldPoint: { x: number; y: number } | null = null;
    private longPressTimer: ReturnType<typeof setTimeout> | null = null;
    private longPressStart: { x: number; y: number } | null = null;
    private gestureFinalizeTimerId: number | null = null;
    private controlsFadeTimerId: number | null = null;

    constructor() {
        let firstModeRun = true;
        effect(() => {
            const mode = this.settings.mode();
            if (firstModeRun) {
                firstModeRun = false;
                return;
            }
            untracked(() => {
                this.cancelLongPress();
                this.showPasteMenu.set(false);
                this.drawTools.cancelSelectionInteraction();
                if (mode === "draw") this.drawTools.clearSelection();
            });
        });

        let firstSelectionRun = true;
        effect(() => {
            this.svgHolder.selectedElementCount();
            if (firstSelectionRun) {
                firstSelectionRun = false;
                return;
            }
            untracked(() => this.selectionActionsDismissed.set(false));
        });

        effect(() => this.svgHolder.setInvertLightness(this.settings.invertLightness()));

        // updateAbilities() her push/undo/redo'da tetiklenir; data-holder'daki aksiyon bazli undo
        // adimlari autosave'i kendisi isaretlemedigi icin tum degisikliklerin tek bogaz noktasi burasi.
        let receivedInitialCanUndo = false;
        const canUndoSubscription = this.undoRedoHelper.canUndo.subscribe((canUndo) => {
            this.canUndo.set(canUndo);
            if (receivedInitialCanUndo) {
                this.autosave.markDirty();
            }
            receivedInitialCanUndo = true;
        });
        const canRedoSubscription = this.undoRedoHelper.canRedo.subscribe((canRedo) => this.canRedo.set(canRedo));

        this.revealControls();
        this.autosave.start(() => this.isPointerDragging);

        afterNextRender(() => this.attachToDom());

        this.destroyRef.onDestroy(() => {
            canUndoSubscription.unsubscribe();
            canRedoSubscription.unsubscribe();
            this.cancelLongPress();
            this.autosave.stop();
            if (this.controlsFadeTimerId !== null) {
                window.clearTimeout(this.controlsFadeTimerId);
                this.controlsFadeTimerId = null;
            }
            this.flushPendingGestureHistory();
            void this.autosave.flush();
        });
    }

    // ---- CanvasDrawToolHost ----

    getCanvasPointInViewBox(offsetX: number, offsetY: number): { x: number; y: number } {
        const scale = this.zoomFactor();
        return { x: this.worldX() + offsetX / scale, y: this.worldY() + offsetY / scale };
    }

    captureHistorySnapshot(): XDrawHistorySnapshot {
        return this.svgHolder.captureUndoSnapshot();
    }

    async restoreHistorySnapshot(snapshot: XDrawHistorySnapshot): Promise<void> {
        await this.svgHolder.restoreUndoSnapshot(snapshot);
    }

    pushHistorySnapshotOperation(before: XDrawHistorySnapshot, after: XDrawHistorySnapshot): void {
        if (
            before.activeLayerId === after.activeLayerId &&
            xdrawBuffersEqual(before.buffer, after.buffer) &&
            xdrawSkeletonsEqual(before.skeleton, after.skeleton)
        ) {
            return;
        }
        void this.undoRedoHelper
            .pushOperationQueue(
                {
                    apply: async () => {
                        await this.svgHolder.restoreUndoSnapshot(after);
                    },
                    revert: async () => {
                        await this.svgHolder.restoreUndoSnapshot(before);
                    },
                },
                true,
                false,
            )
            .catch((error) => console.error("History operation eklenemedi:", error));
        this.autosave.markDirty();
    }

    beginGestureHistoryCapture(): void {
        // Bekleyen bir finalize varsa iptal edilir; yeni stroke ayni undo adimina dahil olur.
        if (this.gestureFinalizeTimerId !== null) {
            window.clearTimeout(this.gestureFinalizeTimerId);
            this.gestureFinalizeTimerId = null;
        }
    }

    finishGestureHistoryCapture(): void {
        if (this.gestureFinalizeTimerId !== null) {
            window.clearTimeout(this.gestureFinalizeTimerId);
        }
        this.gestureFinalizeTimerId = window.setTimeout(() => {
            this.gestureFinalizeTimerId = null;
            this.commitGestureHistory();
        }, GESTURE_FINALIZE_DELAY_MS);
    }

    promptForTextAt(offsetX: number, offsetY: number): void {
        void this.dialogs.textPrompt("xdraw.enter-text").then((value) => {
            if (!value) return;
            const point = this.getCanvasPointInViewBox(offsetX, offsetY);
            this.svgHolder.insertTextAtCanvasPoint(point.x, point.y, value, this.settings.strokeColor(), {
                fontFamily: this.settings.textFontFamily(),
                fontSize: this.settings.textFontSize(),
                fontWeight: this.settings.textBold() ? "bold" : "normal",
            });
        });
    }

    // ---- Sidebar aksiyonlari ----

    protected undo(): void {
        this.flushPendingGestureHistory();
        void this.undoRedoHelper.undo();
    }

    protected redo(): void {
        this.flushPendingGestureHistory();
        void this.undoRedoHelper.redo();
    }

    protected flushAutosave(): void {
        void this.autosave.flush();
    }

    protected async generateNew(): Promise<void> {
        if (!(await this.dialogs.confirm("xdraw.new-project-confirm"))) {
            return;
        }
        this.svgHolder.restoreDrawingSnapshot({
            data: {
                layers: [{ type: "layer", opacity: 1, visible: true, id: "base", elements: [] }],
            },
            activeLayerId: "base",
        });
        void this.undoRedoHelper.reset();
        this.appController.clearActiveFileTarget?.();
    }

    protected downloadProject(saveAs: boolean): void {
        const serialized = JSON.stringify(this.buildExportPayload(), null, 2);
        void this.appController.downloadDataRequest(
            new Blob([serialized], { type: "application/json;charset=utf-8" }),
            "application/json",
            saveAs ? undefined : PROJECT_FILE_NAME,
            { thumbnailFactory: () => this.createThumbnail() },
        );
    }

    protected async saveAndShareProject(): Promise<void> {
        const serialized = JSON.stringify(this.buildExportPayload(), null, 2);
        const blob = new Blob([serialized], { type: "application/json;charset=utf-8" });
        await this.appController.downloadDataRequest(blob, "application/json", PROJECT_FILE_NAME, {
            thumbnailFactory: () => this.createThumbnail(),
        });
        await this.appController.shareDataRequest?.(blob, "application/json", PROJECT_FILE_NAME);
    }

    protected async openProjectFromFile(): Promise<void> {
        if (!(await this.dialogs.confirm("xdraw.open-project-confirm"))) {
            return;
        }
        const file = await this.appController.openFileRequest("application/json");
        if (file) {
            await this.loadProjectFromFileConfirmed(file);
        }
    }

    protected async openRecentFile(id: string): Promise<void> {
        const recentFiles = this.appController.recentFiles;
        if (!recentFiles || !(await this.dialogs.confirm("xdraw.open-project-confirm"))) {
            return;
        }
        // Dosya acilinca icerik onExternalFileOpened callback'i uzerinden yuklenir.
        await recentFiles.open(id);
    }

    protected exportImage(options: XDrawExportImageOptions): void {
        this.flushPendingGestureHistory();
        const zoom = this.zoomFactor();
        const screenBounds = {
            x: this.worldX(),
            y: this.worldY(),
            width: this.canvasWidth / zoom,
            height: this.canvasHeight / zoom,
        };
        const bounds = options.area === "content" ? this.svgHolder.getContentBounds() ?? screenBounds : screenBounds;
        const pixelsPerWorldUnit = (options.area === "screen" ? zoom : 1) * options.scale;
        const pixelCount = Math.ceil(bounds.width * pixelsPerWorldUnit) * Math.ceil(bounds.height * pixelsPerWorldUnit);
        const createExport = async (): Promise<void> => {
            const closeLoading = this.dialogs.showLoading("xdraw.export.preparing");
            try {
                const format = options.format === "jpg" ? "jpeg" : options.format;
                const blob = await this.svgHolder.exportImage({ ...options, bounds, pixelsPerWorldUnit, format });
                await this.appController.downloadDataRequest(blob, `image/${format}`, `xdraw_export.${options.format}`);
            } catch (error) {
                console.error("Export olusturulamadi:", error);
                this.dialogs.error("xdraw.export.error");
            } finally {
                closeLoading();
            }
        };

        if (pixelCount > 32_000_000) {
            const megapixels = String(Math.round(pixelCount / 1_000_000));
            void this.dialogs
                .confirm({ key: "xdraw.export.large-image-warning", parameters: { megapixels } })
                .then((confirmed) => (confirmed ? createExport() : undefined));
            return;
        }
        void createExport();
    }

    // ---- Kontroller ----

    protected revealControls(): void {
        this.menusDimmed.set(false);
        if (this.controlsFadeTimerId !== null) {
            window.clearTimeout(this.controlsFadeTimerId);
        }
        this.controlsFadeTimerId = window.setTimeout(() => {
            this.menusDimmed.set(true);
            this.controlsFadeTimerId = null;
        }, CONTROLS_FADE_DELAY_MS);
    }

    protected resetZoomFromButton(): void {
        this.revealControls();
        this.resetZoom();
    }

    protected teleportNearestElement(rotation: number): void {
        const pointHasLive = this.svgHolder.findNearestPointHasElement(rotation);
        if (!pointHasLive) {
            return;
        }
        const scale = this.zoomFactor();
        this.setCamera(
            pointHasLive.x - this.canvasWidth / scale / 2,
            pointHasLive.y - this.canvasHeight / scale / 2,
        );
    }

    protected copySelection(): void {
        this.svgHolder.finishPendingStroke();
        if (this.svgHolder.copySelectedElements()) this.selectionActionsDismissed.set(true);
    }

    protected cutSelection(): void {
        this.svgHolder.finishPendingStroke();
        const before = this.captureHistorySnapshot();
        if (this.svgHolder.cutSelectedElements()) {
            this.pushHistorySnapshotOperation(before, this.captureHistorySnapshot());
        }
    }

    protected copySelectionFromMenu(): void {
        this.copySelection();
        this.showPasteMenu.set(false);
    }

    protected cutSelectionFromMenu(): void {
        this.cutSelection();
        this.showPasteMenu.set(false);
    }

    protected pasteSelection(): void {
        if (!this.pasteWorldPoint) throw new Error("Paste position is not available.");
        this.svgHolder.finishPendingStroke();
        const before = this.captureHistorySnapshot();
        if (this.svgHolder.pasteClipboardAtPoint(this.pasteWorldPoint.x, this.pasteWorldPoint.y)) {
            this.pushHistorySnapshotOperation(before, this.captureHistorySnapshot());
            this.selectionActionsDismissed.set(false);
        }
        this.showPasteMenu.set(false);
        this.pasteWorldPoint = null;
    }

    // ---- DOM baglama ----

    private attachToDom(): void {
        const surface = this.surfaceRef().nativeElement;
        const listen = (
            target: HTMLElement | Window | VisualViewport,
            type: string,
            handler: (event: never) => void,
            options?: AddEventListenerOptions,
        ): void => {
            const listener = handler as EventListener;
            target.addEventListener(type, listener, options);
            this.destroyRef.onDestroy(() => target.removeEventListener(type, listener, options));
        };

        listen(surface, "pointerdown", (event: PointerEvent) => this.onPointerDown(event));
        listen(surface, "pointermove", (event: PointerEvent) => this.onPointerMove(event));
        listen(surface, "pointerup", (event: PointerEvent) => this.onPointerUp(event));
        listen(surface, "pointercancel", (event: PointerEvent) => this.onPointerUp(event));
        listen(surface, "lostpointercapture", (event: PointerEvent) => this.onPointerUp(event));
        listen(surface, "dblclick", (event: MouseEvent) => this.onDoubleClick(event));
        listen(surface, "wheel", (event: WheelEvent) => this.onMouseWheel(event), { passive: false });
        listen(surface, "keydown", (event: KeyboardEvent) => this.onKeyDown(event));
        listen(surface, "contextmenu", (event: MouseEvent) => this.onCanvasContextMenu(event));

        const syncSize = (): void => this.syncCanvasViewportSize();
        listen(window, "resize", syncSize);
        if (window.visualViewport) {
            listen(window.visualViewport, "resize", syncSize);
            listen(window.visualViewport, "scroll", syncSize);
        }
        listen(window, "beforeunload", () => {
            this.flushPendingGestureHistory();
            void this.autosave.flush();
        });

        this.appController.onExternalFileOpened?.((file) => {
            void this.loadProjectFromFileConfirmed(file);
        });

        const initTimer = setTimeout(() => {
            this.syncCanvasViewportSize();
            this.svgHolder.setActiveCanvas(this.canvasRef().nativeElement);
            this.applyCamera();
            void this.restoreInitialContent();
        }, 150);
        this.destroyRef.onDestroy(() => clearTimeout(initTimer));
    }

    private syncCanvasViewportSize(): void {
        const rect = this.viewportRef().nativeElement.getBoundingClientRect();
        const canvas = this.canvasRef().nativeElement;
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
        canvas.width = rect.width;
        canvas.height = rect.height;
        // Canvas boyutu degisince icerik temizlenir; yeniden cizim tetikle.
        this.applyCamera();
    }

    // ---- Kamera ----

    private currentViewport(): XDrawViewport {
        return { x: this.worldX(), y: this.worldY(), scale: this.zoomFactor() };
    }

    private applyCamera(): void {
        this.svgHolder.setViewCamera(this.currentViewport());
    }

    private setCamera(x: number, y: number, scale = this.zoomFactor()): void {
        this.worldX.set(x);
        this.worldY.set(y);
        this.zoomFactor.set(scale);
        this.applyCamera();
    }

    private applyViewport(viewport: XDrawViewport): void {
        this.syncCanvasViewportSize();
        this.setCamera(viewport.x, viewport.y, viewport.scale);
    }

    private applyZoomAtCanvasPoint(zoom: number, canvasOffsetX: number, canvasOffsetY: number): void {
        const scale = this.zoomFactor();
        // Imlecin altindaki dunya noktasini sabit tutarak yakinlas/uzaklas.
        const worldX = this.worldX() + canvasOffsetX / scale;
        const worldY = this.worldY() + canvasOffsetY / scale;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * zoom));
        const effectiveZoom = newScale / scale;
        if (effectiveZoom === 1) {
            return;
        }
        this.updateToolSizesForZoom(effectiveZoom);
        this.setCamera(worldX - canvasOffsetX / newScale, worldY - canvasOffsetY / newScale, newScale);
    }

    private updateToolSizesForZoom(zoom: number): void {
        if (!this.settings.scaleToolSizesWithZoom()) {
            return;
        }
        this.settings.baseStrokeWidth.set(Math.max(1, Math.min(100, this.settings.baseStrokeWidth() * zoom)));
        this.settings.eraserSize.set(Math.max(4, Math.min(200, this.settings.eraserSize() * zoom)));
    }

    private resetZoom(): void {
        const currentZoom = this.zoomFactor();
        if (currentZoom !== 0) {
            this.updateToolSizesForZoom(1 / currentZoom);
        }
        this.setCamera(0, 0, 1);
    }

    // ---- Proje ----

    private buildExportPayload(): { version: number; exportedAt: string; snapshot: XDrawSnapshot; viewport: XDrawViewport } {
        return {
            version: 1,
            exportedAt: new Date().toISOString(),
            snapshot: this.svgHolder.captureDrawingSnapshot(),
            viewport: this.currentViewport(),
        };
    }

    /** Gecmis listesi icin o anki ekran gorunumunden, uzun kenari 320 px olan kucuk bir onizleme uretir. */
    private async createThumbnail(): Promise<Blob | null> {
        const THUMBNAIL_MAX_SIZE = 320;
        try {
            this.flushPendingGestureHistory();
            // Kullanicinin o an gordugu alan (ekran boyutu + aktif zoom) alinir;
            // tum icerigi sigdirmak cizimi cok kucuk gosteriyordu.
            const zoom = this.zoomFactor();
            const bounds = {
                x: this.worldX(),
                y: this.worldY(),
                width: this.canvasWidth / zoom,
                height: this.canvasHeight / zoom,
            };
            const longestScreenSide = Math.max(this.canvasWidth, this.canvasHeight, 1);
            return await this.svgHolder.exportImage({
                bounds,
                pixelsPerWorldUnit: zoom * Math.min(1, THUMBNAIL_MAX_SIZE / longestScreenSide),
                background: "white",
                format: "webp",
            });
        } catch (error) {
            console.warn("Onizleme gorseli olusturulamadi:", error);
            return null;
        }
    }

    private async loadProjectFromFileConfirmed(file: File): Promise<void> {
        try {
            this.resetPointerInteraction();
            await this.importProjectContent(await file.text());
        } catch (error) {
            console.error("Dosya acilamadi:", error);
            this.dialogs.error("xdraw.file-open-error");
        }
    }

    private async importProjectContent(content: string): Promise<void> {
        const closeLoading = this.dialogs.showLoading("xdraw.importing-project");
        try {
            const before = this.captureHistorySnapshot();
            const parsed = JSON.parse(content) as Partial<ProjectPayload>;
            if (!parsed.snapshot || !parsed.snapshot.data) {
                throw new Error("Gecerli bir XDraw dosyasi degil.");
            }
            await this.svgHolder.restoreDrawingSnapshotFromPersistence(parsed.snapshot);
            if (isValidViewport(parsed.viewport)) {
                this.applyViewport(parsed.viewport);
            }
            this.pushHistorySnapshotOperation(before, this.captureHistorySnapshot());
            this.autosave.markDirty();
            await this.autosave.flush();
            await this.undoRedoHelper.reset();
        } finally {
            closeLoading();
        }
    }

    private async restoreInitialContent(): Promise<void> {
        const restored = await this.autosave.restore(async (payload) => {
            await this.svgHolder.restoreDrawingSnapshotFromPersistence(payload.snapshot);
            this.applyViewport(payload.viewport);
        });
        if (!restored) {
            this.autosave.markDirty();
            await this.autosave.flush();
        }
        const file = await this.appController.checkPendingExternalFile?.();
        if (file) {
            await this.loadProjectFromFileConfirmed(file);
        }
    }

    private commitGestureHistory(): void {
        // Draw/erase icin undo adimlari data-holder icinde aksiyon bazli zaten ekleniyor;
        // burada sadece autosave'i gesture bitince flushluyoruz.
        void this.autosave.flush();
    }

    // Undo/redo veya sayfa kapanisi gibi anlarda bekleyen commit'i hemen tamamlar.
    private flushPendingGestureHistory(): void {
        if (this.gestureFinalizeTimerId !== null) {
            window.clearTimeout(this.gestureFinalizeTimerId);
            this.gestureFinalizeTimerId = null;
        }
        this.commitGestureHistory();
    }

    // ---- Pointer / klavye ----

    private dimControls(): void {
        this.menusDimmed.set(true);
        if (this.controlsFadeTimerId !== null) {
            window.clearTimeout(this.controlsFadeTimerId);
            this.controlsFadeTimerId = null;
        }
    }

    private resetPointerInteraction(): void {
        this.cancelLongPress();
        this.showPasteMenu.set(false);
        this.pointerBusy.set(false);
        this.drawTools.cancelSelectionInteraction();
        this.drawTools.cancelShapeInteraction();
        this.activePointers.clear();
        this.isPointerDragging = false;
        this.activePointerId = null;
        this.lastPinchDistance = 0;
        this.svgHolder.setInteractionMode("idle");
    }

    private getPinchDistance(): number {
        const points = Array.from(this.activePointers.values());
        if (points.length < 2) {
            return 0;
        }
        const [first, second] = points;
        return Math.hypot(second.x - first.x, second.y - first.y);
    }

    private getPinchCenter(): { x: number; y: number } {
        const points = Array.from(this.activePointers.values());
        if (points.length < 2) {
            return { x: this.clickedCameraX(), y: this.clickedCameraY() };
        }
        const [first, second] = points;
        return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
    }

    private getPointerOffsetFromEvent(event: MouseEvent): { x: number; y: number } {
        const target = (event.currentTarget as HTMLElement | null) ?? this.canvasRef().nativeElement;
        const rect = target.getBoundingClientRect();
        return {
            x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
            y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
        };
    }

    private updatePointerPosition(event: PointerEvent): void {
        this.activePointers.set(event.pointerId, this.getPointerOffsetFromEvent(event));
    }

    private onDoubleClick(event: MouseEvent): void {
        const drawType = this.settings.drawType();
        const isShapeTool = this.settings.mode() === "draw" && (drawType === "rectangle" || drawType === "ellipse");
        if (this.settings.mode() !== "pointer" && !isShapeTool) return;
        this.svgHolder.finishPendingStroke();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const point = this.getCanvasPointInViewBox(event.clientX - rect.left, event.clientY - rect.top);
        // Cursor ile ayni isabet testi: move/resize cursor'i gorunen her yerde cift tiklama da calisir.
        const tolerance = 8 / (this.zoomFactor() || 1);
        const shape = this.svgHolder.findShapeHandleAtPoint(point.x, point.y, tolerance)?.shape;
        if (!shape) return;
        event.preventDefault();
        void this.dialogs.textPrompt("xdraw.enter-text", shape.label?.text ?? "").then((value) => {
            // Bos deger iptal ile ayni sonucu verir (BasicOverlayService); etiket degismez.
            if (value === undefined) return;
            const before = this.captureHistorySnapshot();
            const changed = this.svgHolder.updateShapeLabel(shape.id, {
                text: value,
                color: shape.label?.color ?? this.settings.strokeColor(),
                fontFamily: shape.label?.fontFamily ?? this.settings.textFontFamily(),
                fontSize: shape.label?.fontSize ?? this.settings.textFontSize(),
                fontWeight: shape.label?.fontWeight ?? (this.settings.textBold() ? "bold" : "normal"),
            });
            if (changed) this.pushHistorySnapshotOperation(before, this.captureHistorySnapshot());
        });
    }

    private onPointerDown(event: PointerEvent): void {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }
        this.showPasteMenu.set(false);
        this.pointerBusy.set(true);
        this.selectionActionsDismissed.set(false);
        const pointer = this.getPointerOffsetFromEvent(event);
        const overShape = this.updateCanvasCursor(pointer.x, pointer.y, event.pointerType);
        this.updateCursor(pointer.x, pointer.y, true, overShape);

        this.updatePointerPosition(event);
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

        if (this.activePointers.size === 1) {
            if (this.drawTools.shouldPanWithPointer(event.pointerType)) {
                this.revealControls();
            } else {
                this.dimControls();
            }
            this.isPointerDragging = true;
            this.activePointerId = event.pointerId;
            this.smoothedPressure = event.pointerType === "pen" ? Math.max(0, Math.min(1, event.pressure || 0)) : null;
            const strokeWidth = this.drawTools.getStrokeWidthFromPressure(event);
            this.drawTools.startInteraction(pointer.x, pointer.y, event.pointerType, strokeWidth);
            this.startLongPress(event, pointer);
            return;
        }

        if (this.activePointers.size === 2) {
            this.cancelLongPress();
            this.drawTools.cancelSelectionInteraction();
            this.drawTools.cancelShapeInteraction();
            this.revealControls();
            this.isPointerDragging = false;
            this.activePointerId = null;
            this.lastPinchDistance = this.getPinchDistance();
        }
    }

    private onMouseWheel(event: WheelEvent): void {
        this.cancelLongPress();
        this.showPasteMenu.set(false);
        event.preventDefault();
        this.revealControls();
        const wheelUp = event.deltaY < 0;
        const zoomIn = this.settings.zoomDirection() === 1 ? wheelUp : !wheelUp;
        const zoom = zoomIn ? 1.1 : 0.9;
        const pointer = this.getPointerOffsetFromEvent(event);
        this.applyZoomAtCanvasPoint(zoom, pointer.x, pointer.y);
    }

    private onPointerMove(event: PointerEvent): void {
        const pointer = this.getPointerOffsetFromEvent(event);
        if (
            this.longPressStart &&
            Math.hypot(pointer.x - this.longPressStart.x, pointer.y - this.longPressStart.y) >= 4
        ) {
            this.cancelLongPress();
        }
        const overShape = this.updateCanvasCursor(pointer.x, pointer.y, event.pointerType);
        this.updateCursor(pointer.x, pointer.y, this.settings.mode() !== "pointer", overShape);

        if (!this.activePointers.has(event.pointerId)) {
            return;
        }
        this.updatePointerPosition(event);

        if (this.activePointers.size === 2) {
            this.revealControls();
            const pinchDistance = this.getPinchDistance();
            const { x, y } = this.getPinchCenter();
            listenPinch({
                direction: this.settings.zoomDirection(),
                currentDistance: pinchDistance,
                lastDistance: this.lastPinchDistance,
                centerX: x,
                centerY: y,
                onZoom: (zoom, centerX, centerY) => this.applyZoomAtCanvasPoint(zoom, centerX, centerY),
            });
            this.lastPinchDistance = pinchDistance;
            return;
        }

        if (!this.isPointerDragging || this.activePointerId !== event.pointerId) {
            return;
        }

        if (this.drawTools.shouldPanWithPointer(event.pointerType)) {
            this.revealControls();
            const scale = this.zoomFactor();
            const deltaX = pointer.x - this.clickedCameraX();
            const deltaY = pointer.y - this.clickedCameraY();
            this.setCamera(this.worldX() - deltaX / scale, this.worldY() - deltaY / scale);
            this.clickedCameraX.set(pointer.x);
            this.clickedCameraY.set(pointer.y);
        } else {
            this.dimControls();
            this.drawTools.handleToolMove(event, pointer.x, pointer.y);
        }
    }

    /**
     * Shape aracinda farenin altindaki sekle gore (tasima / kenar-kose boyutlandirma) CSS cursor'ini ayarlar.
     * Bir tutamac uzerindeyse true doner.
     */
    private updateCanvasCursor(offsetX: number, offsetY: number, pointerType: string): boolean {
        const shapeCursor = this.drawTools.getShapeCursorAt(offsetX, offsetY, pointerType);
        const cursor = shapeCursor || "crosshair";
        if (cursor !== this.canvasCursor) {
            this.canvasCursor = cursor;
            this.canvasRef().nativeElement.style.cursor = cursor;
        }
        return shapeCursor !== "";
    }

    private updateCursor(offsetX: number, offsetY: number, renderCursor = true, hideBrushPreview = false): void {
        // Boya kovasinda firca onizlemesi anlamsiz; imlec cizilmez.
        if (this.settings.drawType() === "fill") {
            this.svgHolder.setCursorPosition(undefined);
            return;
        }
        // Sekil tutamaci uzerindeyken firca onizlemesi yerine move/resize cursor'i gorunsun.
        const mode = this.settings.mode();
        if (hideBrushPreview || mode === "selection" || mode === "move") {
            this.svgHolder.setCursorPosition(undefined);
            return;
        }
        if (!renderCursor) {
            return;
        }
        const isErase = this.settings.drawType() === "erase";
        this.svgHolder.setCursorPosition({
            x: offsetX,
            y: offsetY,
            size: isErase ? this.settings.eraserSize() : this.settings.baseStrokeWidth(),
            color: this.getStrokeColorWithAlpha(),
            type: isErase ? "outlined" : "filled",
        });
    }

    private getStrokeColorWithAlpha(): string {
        try {
            return ColorUtils.setColorWithAlpha(this.settings.strokeColor(), this.settings.strokeAlpha());
        } catch {
            return this.settings.strokeColor();
        }
    }

    private onPointerUp(event: PointerEvent): void {
        if (!this.activePointers.has(event.pointerId)) return;
        this.cancelLongPress();
        const wasActivePointer = this.activePointerId === event.pointerId;
        const end = this.getPointerOffsetFromEvent(event);
        const cancelled = event.type !== "pointerup";
        if (cancelled) this.drawTools.cancelShapeInteraction();
        this.activePointers.delete(event.pointerId);
        const target = event.currentTarget as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
        }

        if (this.activePointers.size >= 2) {
            this.lastPinchDistance = this.getPinchDistance();
            return;
        }
        this.lastPinchDistance = 0;

        if (this.activePointers.size === 1) {
            const remainingPointerEntry = this.activePointers.entries().next();
            if (remainingPointerEntry.done) {
                this.isPointerDragging = false;
                this.activePointerId = null;
                return;
            }
            const [pointerId, pointerPosition] = remainingPointerEntry.value;
            this.activePointerId = pointerId;
            this.isPointerDragging = true;
            this.clickedCameraX.set(pointerPosition.x);
            this.clickedCameraY.set(pointerPosition.y);
            return;
        }

        this.isPointerDragging = false;
        this.activePointerId = null;
        this.drawTools.finishInteraction(event.pointerType, wasActivePointer ? end : undefined, cancelled);
        this.pointerBusy.set(false);
        // Surukleme bitti; cursor'i yeni konumdaki sekle gore tazele.
        this.updateCanvasCursor(end.x, end.y, event.pointerType);
    }

    private cancelLongPress(): void {
        if (this.longPressTimer !== null) clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
        this.longPressStart = null;
    }

    private startLongPress(event: PointerEvent, point: { x: number; y: number }): void {
        this.cancelLongPress();
        const mode = this.settings.mode();
        if (mode !== "pointer" && mode !== "selection" && mode !== "move") return;
        const pointerId = event.pointerId;
        const clientX = event.clientX;
        const clientY = event.clientY;
        this.longPressStart = point;
        this.longPressTimer = setTimeout(() => {
            this.cancelLongPress();
            if (this.activePointers.size !== 1 || this.activePointerId !== pointerId) return;
            this.drawTools.cancelSelectionInteraction();
            this.isPointerDragging = false;
            this.activePointerId = null;
            this.svgHolder.setInteractionMode("idle");
            this.openContextMenu(point, clientX, clientY);
        }, LONG_PRESS_MS);
    }

    // Kopyala / kes / yapistir menusunu acar. point canvas ofsetidir, clientX/Y menunun ekran konumudur.
    private openContextMenu(point: { x: number; y: number }, clientX: number, clientY: number): void {
        this.pasteWorldPoint = this.getCanvasPointInViewBox(point.x, point.y);
        this.pasteMenuX.set(Math.max(8, Math.min(clientX, window.innerWidth - 280)));
        this.pasteMenuY.set(Math.max(8, Math.min(clientY, window.innerHeight - 100)));
        this.showPasteMenu.set(true);
        this.revealControls();
    }

    private onCanvasContextMenu(event: MouseEvent): void {
        const mode = this.settings.mode();
        if (mode !== "pointer" && mode !== "selection" && mode !== "move") return;
        event.preventDefault();
        // Dokunmatik/kalemde menu uzun basma ile aciliyor; ikinci kez acmayalim.
        const pointerType = (event as PointerEvent).pointerType;
        if (pointerType === "touch" || pointerType === "pen") return;
        this.cancelLongPress();
        this.svgHolder.finishPendingStroke();
        const point = this.getPointerOffsetFromEvent(event);
        // Sag tiklanan eleman seciliyse secim korunur, degilse o eleman secilir.
        const worldPoint = this.getCanvasPointInViewBox(point.x, point.y);
        const hit = this.svgHolder.findElementAtPoint(worldPoint.x, worldPoint.y, 8 / (this.zoomFactor() || 1));
        if (hit && !this.svgHolder.getSelectedElementIds().includes(hit.id)) {
            this.svgHolder.setSelectedElements([hit.id]);
        }
        this.openContextMenu(point, event.clientX, event.clientY);
    }

    private onKeyDown(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (key === "escape") {
            this.cancelLongPress();
            this.showPasteMenu.set(false);
            this.drawTools.cancelShapeInteraction();
            this.drawTools.clearSelection();
            return;
        }
        const isMetaPressed = event.ctrlKey || event.metaKey;
        if (isMetaPressed && (key === "z" || key === "y")) {
            event.preventDefault();
            this.drawTools.cancelShapeInteraction();
            this.flushPendingGestureHistory();
            const action = key === "y" || event.shiftKey ? this.undoRedoHelper.redo() : this.undoRedoHelper.undo();
            void action.catch((error) => console.error("Undo/redo uygulanamadi:", error));
            return;
        }

        const canvas = this.canvasRef().nativeElement;
        listenKey({
            event,
            scale: this.zoomFactor(),
            canvasCenterX: canvas.clientWidth / 2,
            canvasCenterY: canvas.clientHeight / 2,
            onPan: (deltaX, deltaY) => this.setCamera(this.worldX() + deltaX, this.worldY() + deltaY),
            onZoom: (zoom, centerX, centerY) => this.applyZoomAtCanvasPoint(zoom, centerX, centerY),
            onResetZoom: () => this.resetZoomFromButton(),
        });
    }
}
