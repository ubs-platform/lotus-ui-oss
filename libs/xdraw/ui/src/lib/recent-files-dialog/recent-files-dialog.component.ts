import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, output, signal, untracked } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { WebdialogComponent } from "@lotus/front-global/webdialog";
import type { IRecentFilesProvider } from "../app-native-controller";

/** Son dosyalari onizlemeleriyle birlikte gosteren tam ekran gecmis sayfasi. */
@Component({
    selector: "xdraw-recent-files-dialog",
    imports: [WebdialogComponent, UbsTranslatorNgxModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./recent-files-dialog.component.html",
    styleUrl: "./recent-files-dialog.component.scss",
})
export class RecentFilesDialogComponent {
    readonly show = model(false);
    readonly provider = input.required<IRecentFilesProvider>();
    readonly openFile = output<string>();

    // id -> object URL. Sadece dialog acikken dolu tutulur, kapaninca revoke edilir.
    protected readonly thumbnailUrls = signal<Record<string, string>>({});
    private loadToken = 0;

    constructor() {
        effect(() => {
            const show = this.show();
            this.provider().list();
            untracked(() => (show ? void this.loadThumbnails() : this.releaseThumbnails()));
        });
        inject(DestroyRef).onDestroy(() => this.releaseThumbnails());
    }

    protected open(id: string): void {
        this.show.set(false);
        this.openFile.emit(id);
    }

    protected remove(event: Event, id: string): void {
        event.stopPropagation();
        void this.provider().remove(id);
    }

    protected formatDate(savedAt?: number): string {
        return savedAt ? new Date(savedAt).toLocaleString() : "";
    }

    private async loadThumbnails(): Promise<void> {
        const token = ++this.loadToken;
        const provider = this.provider();
        const current = this.thumbnailUrls();
        const next: Record<string, string> = {};
        for (const entry of provider.list()) {
            if (current[entry.id]) {
                next[entry.id] = current[entry.id];
                continue;
            }
            const blob = await provider.getThumbnail(entry.id);
            if (token !== this.loadToken) {
                return;
            }
            if (blob) {
                next[entry.id] = URL.createObjectURL(blob);
            }
        }
        // Listeden dusenlerin URL'lerini birak.
        for (const [id, url] of Object.entries(current)) {
            if (!next[id]) URL.revokeObjectURL(url);
        }
        this.thumbnailUrls.set(next);
    }

    private releaseThumbnails(): void {
        this.loadToken++;
        for (const url of Object.values(this.thumbnailUrls())) {
            URL.revokeObjectURL(url);
        }
        this.thumbnailUrls.set({});
    }
}
