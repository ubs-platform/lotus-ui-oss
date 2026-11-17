import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";
import type { TranslatorText } from "@lotus/extra/translator-core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { TrackbarComponent } from "@lotus/front-global/input/trackbar";

/** Etiketli lib-trackbar; `changeEnd` kullanici surüklemeyi biraktiginda (native change) tetiklenir. */
@Component({
    selector: "xdraw-labeled-trackbar",
    imports: [TrackbarComponent, UbsTranslatorNgxModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-column gap-1 w-full">
            @if (label()) {
                <span class="xdraw-slider-label">{{ label() | translate }}</span>
            }
            <lib-trackbar
                [(value)]="value"
                [minValue]="min()"
                [maxValue]="max()"
                [step]="step()"
                (change)="changeEnd.emit(value())"
            ></lib-trackbar>
        </div>
    `,
    styles: `
        :host {
            display: block;
            width: 100%;
        }
        .xdraw-slider-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--fg);
            opacity: 0.8;
        }
    `,
})
export class LabeledTrackbarComponent {
    readonly label = input<TranslatorText>();
    readonly min = input(0);
    readonly max = input(100);
    readonly step = input(1);
    readonly value = model(0);
    readonly changeEnd = output<number>();
}
