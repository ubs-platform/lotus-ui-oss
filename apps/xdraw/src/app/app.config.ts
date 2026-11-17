import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { APP_NATIVE_CONTROLLER_TOKEN, provideXDrawApp } from '@lotus/xdraw/ui';
import { webAppNativeController } from './web-app-native-controller';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideXDrawApp(),
    { provide: APP_NATIVE_CONTROLLER_TOKEN, useValue: webAppNativeController },
  ],
};
