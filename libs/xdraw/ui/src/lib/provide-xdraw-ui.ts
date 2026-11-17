import { importProvidersFrom, makeEnvironmentProviders, type EnvironmentProviders } from "@angular/core";
import { FrontGlobalMobileGesturesUtilModule } from "@lotus/front-global/mobile-gestures-util";
import { FrontGlobalPromptOverlaysModule } from "@lotus/front-global/prompt-overlays";
import { provideXDrawNotifier } from "./provide-xdraw-notifier";

/** xdraw UI'in ihtiyac duydugu ortam provider'lari (toast notifier, BasicOverlayService, webdialog swipe listener). */
export function provideXDrawUi(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideXDrawNotifier(),
        importProvidersFrom(FrontGlobalPromptOverlaysModule, FrontGlobalMobileGesturesUtilModule),
    ]);
}
