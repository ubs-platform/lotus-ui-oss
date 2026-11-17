import type { XDrawHistorySnapshot } from "../../state/data-holder";
import type { XDrawPoint } from "../../model/xdraw-data";
import type { CanvasDrawToolHost } from "./canvas-tool-host";

/**
 * Seçili elemanları sürükleyerek taşır. Geçmişe tek adım yazar; iptalde eski hâle döner.
 * İmlecin altındaki eleman seçili değilse onu seçip taşır. Boş alana sadece tıklanırsa seçimi temizler.
 */
export class MoveTool {
    private active = false;
    private startScreen: XDrawPoint | null = null;
    private lastPoint: XDrawPoint | null = null;
    private elementIds: string[] = [];
    private moveEnabled = false;
    private beforeSnapshot: XDrawHistorySnapshot | null = null;
    private moved = false;

    constructor(private host: CanvasDrawToolHost) { }

    get isActive(): boolean {
        return this.active;
    }

    start(offsetX: number, offsetY: number): void {
        this.host.svgHolder.finishPendingStroke();
        const point = this.host.getCanvasPointInViewBox(offsetX, offsetY);
        this.elementIds = this.host.svgHolder.getSelectedElementIds();
        const hit = this.host.svgHolder.findElementAtPoint(
            point.x,
            point.y,
            8 / (this.host.zoomFactor() || 1),
        );
        if (hit && !this.elementIds.includes(hit.id)) {
            this.host.svgHolder.setSelectedElements([hit.id]);
            this.elementIds = this.host.svgHolder.getSelectedElementIds();
        }
        this.active = true;
        this.startScreen = { x: offsetX, y: offsetY };
        this.lastPoint = point;
        this.beforeSnapshot = null;
        this.moved = false;
        this.moveEnabled = Boolean(hit && this.elementIds.includes(hit.id));
        if (this.moveEnabled) {
            this.host.svgHolder.setInteractionMode("move");
        }
    }

    move(offsetX: number, offsetY: number): void {
        if (!this.moveEnabled || this.elementIds.length === 0 || !this.lastPoint) return;
        const point = this.host.getCanvasPointInViewBox(offsetX, offsetY);
        const deltaX = point.x - this.lastPoint.x;
        const deltaY = point.y - this.lastPoint.y;
        this.lastPoint = point;
        if (deltaX === 0 && deltaY === 0) return;
        this.beforeSnapshot ??= this.host.captureHistorySnapshot();
        this.moved = this.host.svgHolder.moveElementsBy(this.elementIds, deltaX, deltaY) || this.moved;
    }

    finish(end: XDrawPoint | undefined, cancelled: boolean): void {
        if (end && !cancelled) this.move(end.x, end.y);
        const isClick = Boolean(end && this.startScreen
            && Math.hypot(end.x - this.startScreen.x, end.y - this.startScreen.y) < 4);
        if (!cancelled && isClick && !this.moveEnabled) {
            this.host.svgHolder.setSelectedElements([]);
        }
        if (cancelled && this.beforeSnapshot) {
            void this.host.restoreHistorySnapshot(this.beforeSnapshot)
                .catch((error) => console.error("Cancelled move could not be restored:", error));
        } else if (this.moved && this.beforeSnapshot) {
            this.host.pushHistorySnapshotOperation(this.beforeSnapshot, this.host.captureHistorySnapshot());
        }
        this.startScreen = null;
        this.lastPoint = null;
        this.beforeSnapshot = null;
        this.moved = false;
        this.active = false;
        this.elementIds = [];
        this.moveEnabled = false;
        this.host.smoothedPressure = null;
        this.host.svgHolder.setInteractionMode("idle");
    }
}
