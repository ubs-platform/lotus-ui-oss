import { IdbKeyValueStore, XDRAW_SETTING_KEYS, type XDrawSnapshot } from "@lotus/xdraw/core";

export interface XDrawViewport {
    x: number;
    y: number;
    scale: number;
}

export interface AutosavePayload {
    snapshot: XDrawSnapshot;
    viewport: XDrawViewport;
    savedAt: string;
}

const AUTOSAVE_INTERVAL_MS = 1200;

export function isValidViewport(viewport: Partial<XDrawViewport> | undefined): viewport is XDrawViewport {
    return !!(
        viewport &&
        Number.isFinite(viewport.x) &&
        Number.isFinite(viewport.y) &&
        Number.isFinite(viewport.scale) &&
        Number(viewport.scale) > 0
    );
}

function isValidAutosavePayload(parsed: Partial<AutosavePayload> | undefined): parsed is AutosavePayload {
    return !!(
        parsed?.snapshot &&
        parsed.snapshot.data &&
        typeof parsed.snapshot.activeLayerId === "string" &&
        isValidViewport(parsed.viewport)
    );
}

/** Cizimi periyodik olarak IndexedDB'ye kaydeder (localStorage'in aksine buyuk cizimlerde kota hatasi vermez). */
export class XDrawAutosave {
    private dirty = false;
    private writePromise: Promise<void> | null = null;
    private timerId: number | null = null;
    private readonly store = new IdbKeyValueStore("xdraw-autosave", "snapshots");

    constructor(private readonly createPayload: () => AutosavePayload) {}

    markDirty(): void {
        this.dirty = true;
    }

    async flush(): Promise<void> {
        if (!this.dirty) {
            return;
        }
        if (this.writePromise !== null) {
            await this.writePromise;
            return;
        }
        this.writePromise = this.write();
        try {
            await this.writePromise;
        } finally {
            this.writePromise = null;
        }
    }

    start(isBusy: () => boolean): void {
        this.stop();
        this.timerId = window.setInterval(() => {
            if (!isBusy()) {
                void this.flush();
            }
        }, AUTOSAVE_INTERVAL_MS);
    }

    stop(): void {
        if (this.timerId !== null) {
            window.clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    /** Kayitli otomatik kaydi bulursa `apply` ile uygular ve true doner. */
    async restore(apply: (payload: AutosavePayload) => Promise<void>): Promise<boolean> {
        try {
            const fromIdb = await this.store.get<AutosavePayload>(XDRAW_SETTING_KEYS.autosaveSnapshot);
            if (isValidAutosavePayload(fromIdb)) {
                await apply(fromIdb);
                return true;
            }
        } catch (error) {
            console.error("Autosave (IndexedDB) okunamadi:", error);
        }

        // Eskiden localStorage'a yazilmis kayit varsa bir kereligine IndexedDB'ye tasi.
        const raw = localStorage.getItem(XDRAW_SETTING_KEYS.autosaveSnapshot);
        if (!raw) {
            return false;
        }
        try {
            const parsed = JSON.parse(raw) as Partial<AutosavePayload>;
            if (!isValidAutosavePayload(parsed)) {
                return false;
            }
            await apply(parsed);
            localStorage.removeItem(XDRAW_SETTING_KEYS.autosaveSnapshot);
            await this.store.set(XDRAW_SETTING_KEYS.autosaveSnapshot, parsed);
            return true;
        } catch (error) {
            console.error("Autosave parse edilemedi:", error);
            return false;
        }
    }

    private async write(): Promise<void> {
        try {
            const payload = this.createPayload();
            // Yazim surerken gelen degisiklikler dirty durumunu tekrar true yapabilsin.
            this.dirty = false;
            await this.store.set(XDRAW_SETTING_KEYS.autosaveSnapshot, payload);
        } catch (error) {
            this.dirty = true;
            console.error("Autosave yazilamadi:", error);
        }
    }
}
