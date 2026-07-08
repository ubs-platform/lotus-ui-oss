import { Component, Inject, OnInit } from '@angular/core';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';
import { ConfirmConfig } from '../../model/confirm-config.model';

@Component({
  selector: 'lotus-web-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false,
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(WEBDIALOG_CONFIG)
    public config: IWebDialogConfig<ConfirmConfig, boolean>,
    private dialogRef: WebdialogReference<boolean>
  ) {}

  showDialog() {
    // this.confirmationService.confirmPrime({
    //   message: ,
    //   header: 'Confirmation',
    //   icon: 'material-symbols-outlined', iconContent: 'warning',
    //   accept: () => {},
    //   reject: (type) => {},
    // });
  }

  ngOnInit(): void {}

  decision(eventx: boolean) {
    this.dialogRef.close(eventx);
  }
}
