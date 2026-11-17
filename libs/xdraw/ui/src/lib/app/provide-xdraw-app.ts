import { provideHttpClient } from "@angular/common/http";
import {
    makeEnvironmentProviders,
    provideEnvironmentInitializer,
    provideZonelessChangeDetection,
    type EnvironmentProviders,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { EnvironmentController, LANGUAGE_JSON_URL } from "@lotus/extra/ubs-translator-ngx";
import { provideDialogAwareHistory } from "@lotus/front-global/webdialog";
import { CanvasDrawComponent } from "../canvas-draw/canvas-draw.component";
import { provideXDrawUi } from "../provide-xdraw-ui";

export interface XDrawAppOptions {
    /** Platforma ozel ek ceviri dosyalari (ortak `localization/` ve `lang/` dosyalarindan sonra yuklenir). */
    extraTranslationUrls?: Array<(language: string) => string>;
}

const AVAILABLE_LANGUAGES = ["tr-tr", "en-us"];

function selectLanguage(): string {
    const browserLanguage = navigator.language.toLowerCase();
    return AVAILABLE_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en-us";
}

/**
 * xdraw uygulama kabuklarinin (web, mobil) ortak provider'lari.
 * Kabuk ayrica `APP_NATIVE_CONTROLLER_TOKEN` saglamalidir.
 */
export function provideXDrawApp(options: XDrawAppOptions = {}): EnvironmentProviders {
    const language = selectLanguage();
    return makeEnvironmentProviders([
        provideZonelessChangeDetection(),
        provideRouter([{ path: "", component: CanvasDrawComponent }]),
        provideHttpClient(),
        {
            provide: LANGUAGE_JSON_URL,
            // Ortak lotus-web cevirileri (dialog/buton metinleri) + xdraw'a ozel ceviriler
            useValue: [
                (lang: string) => `localization/${lang}.json`,
                (lang: string) => `lang/${lang}.json`,
                ...(options.extraTranslationUrls ?? []),
            ],
        },
        provideEnvironmentInitializer(() => {
            EnvironmentController.getEnvironmentController(language, true).setLanguage(language);
        }),
        provideDialogAwareHistory(),
        provideXDrawUi(),
    ]);
}
