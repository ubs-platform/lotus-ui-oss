import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { ToggleComponent } from "@lotus/front-global/input/toggle";
import { XDrawSettingsConfig } from "@lotus/xdraw/core";
import { LabeledTrackbarComponent } from "../shared/labeled-trackbar.component";

@Component({
    selector: "xdraw-pen-settings-panel",
    imports: [UbsTranslatorNgxModule, ToggleComponent, LabeledTrackbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="xdraw-panel flex flex-column gap-2">
            <h2>{{ 'xdraw.draw.pen-settings' | translate }}</h2>
            <xdraw-labeled-trackbar label="xdraw.draw.brush-size" [min]="1" [max]="100" [(value)]="settings.baseStrokeWidth" />
            <xdraw-labeled-trackbar label="xdraw.draw.eraser-size" [min]="4" [max]="200" [(value)]="settings.eraserSize" />
            <toggle [checkboxStyle]="true" label="xdraw.draw.allow-only-pen-on-tablet"
                [value]="settings.stylusModeEnabled()" (valueChange)="settings.stylusModeEnabled.set(!!$event)" />
            <toggle [checkboxStyle]="true" label="xdraw.draw.size-change-by-pressure"
                [value]="settings.pressureWidthEnabled()" (valueChange)="settings.pressureWidthEnabled.set(!!$event)" />
            <toggle [checkboxStyle]="true" label="xdraw.draw.scale-tool-sizes-with-zoom"
                [value]="settings.scaleToolSizesWithZoom()" (valueChange)="settings.scaleToolSizesWithZoom.set(!!$event)" />
            <toggle [checkboxStyle]="true" label="xdraw.draw.invert-lightness"
                [value]="settings.invertLightness()" (valueChange)="settings.invertLightness.set(!!$event)" />
            <xdraw-labeled-trackbar label="xdraw.draw.pen-pressure-smoothing" [min]="0" [max]="1" [step]="0.01"
                [(value)]="settings.pressureSmoothing" />
            <h2>{{ 'xdraw.draw.navigation-settings' | translate }}</h2>
            <toggle [checkboxStyle]="true" label="xdraw.draw.use-web-worker"
                [value]="settings.useWebWorker()" (valueChange)="settings.useWebWorker.set(!!$event)" />
            <toggle [checkboxStyle]="true" label="xdraw.draw.invert-zoom-direction"
                [value]="settings.zoomDirection() === -1" (valueChange)="settings.zoomDirection.set($event ? -1 : 1)" />
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
export class PenSettingsPanelComponent {
    protected readonly settings = inject(XDrawSettingsConfig);
}
