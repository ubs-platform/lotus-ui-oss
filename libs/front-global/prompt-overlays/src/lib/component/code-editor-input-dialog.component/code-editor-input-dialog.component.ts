import {
  DialogVisibilityReference,
  generateMobileOptimizedDialogHideController,
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'lotus-web-basic-text-input-dialog',
  templateUrl: './code-editor-input-dialog.component.html',
  standalone: false,
})
export class CodeEditorTextInputDialogComponent {
  title: string = '';
  value?: string;
  monacoOps: any;
  constructor(
    private dial: WebdialogReference<string>,
    @Inject(WEBDIALOG_CONFIG)
    private dialogConfig: IWebDialogConfig<
      {
        title: string;
        language: string;
        initialValue: string;
      },
      string
    >
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.title = this.dialogConfig.data?.title || '';
    this.value = this.dialogConfig.data?.initialValue;
    this.monacoOps = {
      language: this.dialogConfig.data?.language || 'plaintext',
      theme: 'vs-dark',
      mouseWheelZoom: true,
    };
  }

  close(arg0?: string) {
    this.dial.close(arg0);
  }
}
