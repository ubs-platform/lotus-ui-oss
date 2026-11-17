import { bootstrapApplication } from '@angular/platform-browser';
import { XDrawAppShellComponent } from '@lotus/xdraw/ui';
import { appConfig } from './app/app.config';

bootstrapApplication(XDrawAppShellComponent, appConfig).catch((err) => console.error(err));
