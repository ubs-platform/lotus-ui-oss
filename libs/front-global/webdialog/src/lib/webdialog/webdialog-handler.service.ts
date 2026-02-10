import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { WebdialogComponent } from './webdialog.component';
import { IWebDialogConfig } from './config';
import { WEBDIALOG_CONFIG } from './tokens';
import { WebdialogReference } from './reference';

@Injectable()
export class WebdialogHandler {
  /**
   *
   */

  rootElement = document.body;

  constructor(private appRef: ApplicationRef, private injector: Injector) {
    // appRef.attachView()
    //@ts-ignore
    // console.info(appRef);
  }

  open<T = any, O = any>(
    contentComponentClass: any,
    config?: IWebDialogConfig<T, O>
  ) {
    this.rootElement = this.appRef.components[0].location.nativeElement;
    const wdr = new WebdialogReference<O>();
    wdr.setCurrentValue(config?.defaultOutValue!);
    const customInjector = Injector.create({
      providers: [
        { provide: WEBDIALOG_CONFIG, useValue: config },
        { provide: WebdialogReference, useValue: wdr },
      ],
      parent: this.injector,
    });

    const viewContainerRef =
      this.appRef.components[0].injector.get(ViewContainerRef);
    const contentComponent = viewContainerRef.createComponent(
      contentComponentClass,
      { injector: customInjector }
    );
    const dialog = this.createWebdialog(
      viewContainerRef,
      contentComponent,
      config
    );
    wdr.setComponent(dialog.instance);
    return wdr;
  }

  private createWebdialog(
    viewContainerRef: ViewContainerRef,
    contentComponent: ComponentRef<unknown>,
    config?: IWebDialogConfig<any, any>
  ) {
    const dial = viewContainerRef.createComponent(
      WebdialogComponent
    ) as ComponentRef<WebdialogComponent>;
    dial.instance.position.set(config?.position || 'center')
    dial.instance.title.set(config?.title || '');
    dial.instance.displayCloseButton.set(config?.displayCloseButton ?? true);
    dial.instance.displayHeader.set(config?.displayHeader ?? true);
    dial.instance.contentComponentRef = contentComponent;
    dial.instance.maxWidth.set(config?.maxWidth || dial.instance.maxWidth());
    dial.instance.maxHeight.set(config?.maxHeight || dial.instance.maxHeight());
    dial.instance.width.set(config?.width || dial.instance.width());
    dial.instance.height.set(config?.height || dial.instance.height());
    dial.instance.padding.set(config?.padding ?? dial.instance.padding());
    dial.changeDetectorRef.detectChanges();
    dial.changeDetectorRef.markForCheck();
    dial.changeDetectorRef.reattach();
    dial.instance.showDialogByReference();
    this.rootElement.appendChild(dial.location.nativeElement);
    return dial;
  }
}
