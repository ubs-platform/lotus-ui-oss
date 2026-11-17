import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import type { TranslatorText } from "@lotus/extra/translator-core";
import { BasicOverlayService } from "@lotus/front-global/prompt-overlays";
import { LoadingData, LoadingIndicationService } from "@lotus/front-global/user-service-wraps";

/** xdraw bilesenlerinin kullandigi diyaloglari lotus-web overlay servisleri uzerinden sunar. */
@Injectable({ providedIn: "root" })
export class XDrawDialogs {
    private readonly overlay = inject(BasicOverlayService);
    private readonly loading = inject(LoadingIndicationService);
    private loadingCounter = 0;

    async confirm(message: TranslatorText, title: TranslatorText = "general.confirm"): Promise<boolean> {
        return (await firstValueFrom(this.overlay.confirm(title, message))) === true;
    }

    error(message: TranslatorText): void {
        this.overlay.alert("general.error", message, "error");
    }

    /** Iptal veya bos deger `undefined` doner. */
    async textPrompt(title: TranslatorText, initialValue = ""): Promise<string | undefined> {
        return (await firstValueFrom(this.overlay.textInputBasic(title, initialValue))) || undefined;
    }

    showLoading(title: TranslatorText): () => void {
        const registration = this.loading.register(new LoadingData(`xdraw-loading-${++this.loadingCounter}`, true, title));
        return () => registration.close();
    }
}
