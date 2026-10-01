import { Injectable } from '@angular/core';

@Injectable()
export class DebugKeyValueViewComponentService {
  constructor() {}

  public showDialog() {
    console.warn('DebugKeyValueViewComponent dialog is not implemented yet.');
    // this.dialogService.open(DebugKeyValueViewComponent, {
    //   modal: false,
    //   maximizable: true,
    //   draggable: true,
    // });
    // şimdilik noop, sonra webdiyaloga bağlarız, webdialog'a da taşıma ve maskesiz açma işlemi yaparız.
  }
}
