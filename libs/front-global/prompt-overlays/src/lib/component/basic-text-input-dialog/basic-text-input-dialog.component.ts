import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';

@Component({
  selector: 'lotus-web-basic-text-input-dialog',
  templateUrl: './basic-text-input-dialog.component.html',
  styleUrls: ['./basic-text-input-dialog.component.scss'],
  standalone: false,
})
export class BasicTextInputDialogComponent {
  title?: string = '';
  value?: string;
  longTextMode = false;
  constructor(
    private dial: WebdialogReference<string>,
    @Inject(WEBDIALOG_CONFIG)
    private dialogConfig: IWebDialogConfig<
      {
        title: string;
        initialValue: string;
        longTextMode?: boolean;
      },
      string
    >
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.title = this.dialogConfig.data?.title;
    this.value = this.dialogConfig.data?.initialValue;
    this.longTextMode = this.dialogConfig.data?.longTextMode || false;
  }

  close(arg0?: string) {
    this.dial.close(arg0);
  }
}
