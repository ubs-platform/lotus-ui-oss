import { ChangeDetectionStrategy, Component, effect, input, output, signal, untracked } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import type { XDrawDataHolder, XDrawLayer } from "@lotus/xdraw/core";
import { LabeledTrackbarComponent } from "../shared/labeled-trackbar.component";

@Component({
    selector: "xdraw-layers-panel",
    imports: [UbsTranslatorNgxModule, FrontGlobalButtonModule, LabeledTrackbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="xdraw-panel flex flex-column gap-1">
            @for (layer of holder().layersState(); track layer.id) {
                <div class="flex align-items-center gap-1">
                    <block-button
                        class="flex-grow-1"
                        [cover]="true"
                        [buttonClass]="holder().activeLayerId() === layer.id ? 'primary' : 'surface'"
                        iconClass="material-symbols-outlined"
                        [iconContent]="layer.id === 'base' ? 'star' : 'layers'"
                        [stringContent]="layer.id === 'base' ? 'xdraw.layer.base' : { key: 'xdraw.layer.nth', parameters: { n: layer.id } }"
                        (click)="selectLayer(layer)"
                    ></block-button>
                    @if (layer.id !== 'base') {
                        <block-button
                            buttonClass="surface"
                            iconClass="material-symbols-outlined"
                            iconContent="delete"
                            (click)="holder().deleteLayer(layer.id)"
                        ></block-button>
                    }
                </div>
            }
            <block-button
                [cover]="true"
                buttonClass="border"
                iconClass="material-symbols-outlined"
                iconContent="add"
                stringContent="xdraw.layer.new"
                (click)="holder().createLayer()"
            ></block-button>
            <h2>{{ 'xdraw.layer.settings' | translate }}</h2>
            <xdraw-labeled-trackbar
                label="xdraw.layer.opacity"
                [min]="0"
                [max]="1"
                [step]="0.01"
                [value]="activeLayerOpacity()"
                (valueChange)="onOpacityInput($event)"
                (changeEnd)="onOpacityCommit($event)"
            />
        </div>
    `,
    styles: `
        .xdraw-panel {
            width: 280px;
            max-height: 70dvh;
            overflow: auto;
        }
    `,
})
export class LayersPanelComponent {
    readonly holder = input.required<XDrawDataHolder>();
    readonly opacityCommitted = output<void>();

    protected readonly activeLayerOpacity = signal(1);
    private opacityDragBeforeValue: number | null = null;

    constructor() {
        effect(() => {
            const holder = this.holder();
            untracked(() => this.activeLayerOpacity.set(holder.getActiveLayerOpacity() || 1));
        });
    }

    protected selectLayer(layer: XDrawLayer): void {
        this.holder().setActiveLayer(layer.id);
        this.activeLayerOpacity.set(layer.opacity ?? 1);
    }

    protected onOpacityInput(value: number): void {
        const holder = this.holder();
        if (this.opacityDragBeforeValue === null) {
            this.opacityDragBeforeValue = holder.getActiveLayerOpacity() ?? value;
        }
        this.activeLayerOpacity.set(value);
        holder.setLayerOpacityLive(holder.getActiveLayerId(), value);
    }

    protected onOpacityCommit(value: number): void {
        const holder = this.holder();
        const beforeValue = this.opacityDragBeforeValue ?? value;
        this.opacityDragBeforeValue = null;
        holder.setLayerOpacity(holder.getActiveLayerId(), value, beforeValue);
        this.opacityCommitted.emit();
    }
}
