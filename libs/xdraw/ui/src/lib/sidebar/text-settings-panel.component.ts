import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { UbsTranslatorNgxModule } from "@lotus/extra/ubs-translator-ngx";
import { ToggleComponent } from "@lotus/front-global/input/toggle";
import { XDrawSettingsConfig } from "@lotus/xdraw/core";
import { LabeledTrackbarComponent } from "../shared/labeled-trackbar.component";

@Component({
    selector: "xdraw-text-settings-panel",
    imports: [UbsTranslatorNgxModule, ToggleComponent, LabeledTrackbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="xdraw-panel flex flex-column gap-2">
            <h2>{{ 'xdraw.text.settings' | translate }}</h2>
            <label class="xdraw-field flex flex-column gap-1">
                {{ 'xdraw.text.font-family' | translate }}
                <select [value]="settings.textFontFamily()" (change)="onFontFamilyChange($event)">
                    @for (font of fontFamilies; track font.value) {
                        <option [value]="font.value">{{ font.label }}</option>
                    }
                </select>
            </label>
            <xdraw-labeled-trackbar label="xdraw.text.font-size" [min]="8" [max]="120" [(value)]="settings.textFontSize" />
            <toggle [checkboxStyle]="true" label="xdraw.text.bold"
                [value]="settings.textBold()" (valueChange)="settings.textBold.set(!!$event)" />
        </div>
    `,
    styles: `
        .xdraw-panel {
            width: 280px;
        }
        .xdraw-field {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--fg);
        }
        select {
            width: 100%;
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            background: var(--bg-1);
            color: var(--fg);
        }
    `,
})
export class TextSettingsPanelComponent {
    protected readonly settings = inject(XDrawSettingsConfig);
    protected readonly fontFamilies = [
        { value: "system-ui", label: "System UI" },
        { value: "Arial", label: "Arial" },
        { value: "Georgia", label: "Georgia" },
        { value: "monospace", label: "Monospace" },
    ];

    protected onFontFamilyChange(event: Event): void {
        this.settings.textFontFamily.set((event.target as HTMLSelectElement).value);
    }
}
