import { ChangeDetectionStrategy, Component, model, output, signal } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import { WebdialogComponent } from "@lotus/front-global/webdialog";

export interface XDrawExportImageOptions {
    area: "screen" | "content";
    background: "white" | "transparent" | "grid";
    scale: 1 | 2 | 4;
    format: "png" | "webp" | "jpg";
}

@Component({
    selector: "xdraw-export-dialog",
    imports: [WebdialogComponent, UbsTranslatorNgxModule, FrontGlobalButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lib-webdialog [(show)]="show" width="360px" [title]="'xdraw.export.title'">
            <div class="flex flex-column gap-3">
                <label class="xdraw-field flex flex-column gap-1">
                    {{ 'xdraw.export.area' | translate }}
                    <select [value]="area()" (change)="area.set($any($event.target).value)">
                        <option value="screen">{{ 'xdraw.export.area-screen' | translate }}</option>
                        <option value="content">{{ 'xdraw.export.area-content' | translate }}</option>
                    </select>
                </label>
                <label class="xdraw-field flex flex-column gap-1">
                    {{ 'xdraw.export.background' | translate }}
                    <select [value]="background()" (change)="background.set($any($event.target).value)">
                        <option value="white">{{ 'xdraw.export.background-white' | translate }}</option>
                        <option value="transparent">{{ 'xdraw.export.background-transparent' | translate }}</option>
                        <option value="grid">{{ 'xdraw.export.background-grid' | translate }}</option>
                    </select>
                </label>
                <label class="xdraw-field flex flex-column gap-1">
                    {{ 'xdraw.export.scale' | translate }}
                    <select [value]="'' + scale()" (change)="setScale($any($event.target).value)">
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="4">4x</option>
                    </select>
                </label>
                <label class="xdraw-field flex flex-column gap-1">
                    {{ 'xdraw.export.format' | translate }}
                    <select [value]="format()" (change)="format.set($any($event.target).value)">
                        <option value="png">PNG</option>
                        <option value="webp">WEBP</option>
                        <option value="jpg">JPG</option>
                    </select>
                </label>
                <block-button
                    buttonClass="primary"
                    stringContent="xdraw.export.create-and-download"
                    (click)="submit()"
                ></block-button>
            </div>
        </lib-webdialog>
    `,
    styles: `
        .xdraw-field {
            font-size: 0.875rem;
        }
    `,
})
export class ExportDialogComponent {
    readonly show = model(false);
    readonly exportImage = output<XDrawExportImageOptions>();

    protected readonly area = signal<XDrawExportImageOptions["area"]>("screen");
    protected readonly background = signal<XDrawExportImageOptions["background"]>("white");
    protected readonly scale = signal<XDrawExportImageOptions["scale"]>(1);
    protected readonly format = signal<XDrawExportImageOptions["format"]>("png");

    protected setScale(value: string): void {
        this.scale.set(Number(value) as XDrawExportImageOptions["scale"]);
    }

    protected submit(): void {
        this.exportImage.emit({
            area: this.area(),
            background: this.background(),
            scale: this.scale(),
            format: this.format(),
        });
        this.show.set(false);
    }
}
