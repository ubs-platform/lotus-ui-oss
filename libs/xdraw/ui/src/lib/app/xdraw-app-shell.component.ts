import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LoadingIndicatorModule } from "@lotus/front-global/loading-indicator";
import { ToastHostComponent } from "@lotus/front-global/toast";
import { XDrawSettingsConfig } from "@lotus/xdraw/core";

/** xdraw uygulamalarinin kok bileseni: toast, yukleme gostergesi ve tema. */
@Component({
    selector: "xdraw-root",
    imports: [RouterOutlet, ToastHostComponent, LoadingIndicatorModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lotus-web-toast-host></lotus-web-toast-host>
        <lotus-web-fullscreen-loading-indicator></lotus-web-fullscreen-loading-indicator>
        <router-outlet></router-outlet>
    `,
})
export class XDrawAppShellComponent {
    private readonly settings = inject(XDrawSettingsConfig);

    constructor() {
        // lotus-web temalari <html theme="..."> uzerinden calisir (ThemeManager ile ayni konvansiyon).
        effect(() => document.documentElement.setAttribute("theme", this.settings.appTheme()));
    }
}
