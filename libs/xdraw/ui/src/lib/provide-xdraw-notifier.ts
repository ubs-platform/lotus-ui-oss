import { inject, makeEnvironmentProviders, provideAppInitializer, type EnvironmentProviders } from "@angular/core";
import { setXDrawNotifier } from "@lotus/xdraw/core";
import { TranslatorRepositoryService } from "@lotus/extra/ubs-translator-ngx";
import { ToastService } from "@lotus/front-global/toast";

/** Core'un UI'dan bagimsiz uyarilarini lotus-web toast'u ve ceviri deposu uzerinden gosterir. */
export function provideXDrawNotifier(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideAppInitializer(() => {
            const toast = inject(ToastService);
            const translator = inject(TranslatorRepositoryService);
            setXDrawNotifier({
                warning: (notification, durationMs) =>
                    toast.add({
                        severity: "warn",
                        detail: "translationKey" in notification
                            ? translator.getString(notification.translationKey)
                            : notification.text,
                        life: durationMs,
                    }),
            });
        }),
    ]);
}
