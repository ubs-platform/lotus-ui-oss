import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DebugKeyValueViewComponent } from '../component/debug-key-value-view/debug-key-value-view.component';

@Injectable()
export class DebugKeyValueViewComponentService {
  constructor(private dialogService: DialogService) {}

  public showDialog() {
    this.dialogService.open(DebugKeyValueViewComponent, {
      modal: false,
      maximizable: true,
      draggable: true,
    });
  }
}
