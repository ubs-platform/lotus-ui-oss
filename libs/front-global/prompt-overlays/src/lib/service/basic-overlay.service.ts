import { Injectable } from '@angular/core';
import { TranslatorText } from '@ubs-platform/translator-core';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { BasicTextInputDialogComponent } from '../component/basic-text-input-dialog/basic-text-input-dialog.component';
import { CodeEditorTextInputDialogComponent } from '../component/code-editor-input-dialog.component/code-editor-input-dialog.component';
import { InstantModalComponent } from '../component/instant-modal/instant-modal.component';
import { InstantModalOptions } from '../model/instant-modal-options.model';
import { Reform } from '@lotus/front-global/minky/core';
import { ReformDialogComponent } from '../component/reform-dialog/reform-dialog.component';
import {
  DialogVisibilityReference,
  DialogInformation,
  generateMobileOptimizedDialogHideController,
  WebDialogUtils,
  WebdialogHandler,
  IWebDialogConfig,
} from '@lotus/front-global/webdialog';
import { ConfirmDialogComponent } from '../component/confirm-dialog/confirm-dialog.component';
import { ConfirmConfig } from '../model/confirm-config.model';
@Injectable()
export class BasicOverlayService {
  constructor(
    private messageService: MessageService,
    private translator: TranslatorRepositoryService,
    private webdialogHandler: WebdialogHandler
  ) {
    WebDialogUtils.infoAlertForBackIssue = () => {
      this.alert(
        "Bir kere daha geri'ye basın",
        'Eğer herhangi bir diyalog açıkken refresh yaptıysanız, birkaç kere geri tuşuna basmanız gerekebilir. Bu, tarayıcı kaynaklı teknik bir sınırlamadan kaynaklanıyor',
        'info'
      );
    };
  }

  public showInstantModal(data: InstantModalOptions) {
    return this.webdialogHandler.open(InstantModalComponent, {
      data,
      width: data.width,
      height: data.height,
      displayHeader: data.header,
      defaultOutValue: false,
    });
  }

  private dialogPosition(): 'bottom-center' | 'center' | undefined {
    return DialogInformation.onMobile ? 'bottom-center' : 'center';
  }

  public showComponentAsDialog<T, O>(c: any, config: IWebDialogConfig<T, O>) {
    if (config.position == null) config.position = this.dialogPosition();
    return this.webdialogHandler.open(c, config);
  }

  // /**
  //  * @deprecated
  //  * @param c
  //  * @param data
  //  * @param additional
  //  * @returns
  //  */
  // showComponentAsDialogPrime(
  //   c: any,
  //   data: any,
  //   additional?: {
  //     height?: string;
  //     width?: string;
  //     header?: string;
  //     position?:
  //       | 'center'
  //       | 'top'
  //       | 'bottom'
  //       | 'left'
  //       | 'right'
  //       | 'top-left'
  //       | 'top-right'
  //       | 'bottom-left'
  //       | 'bottom-right';
  //   }
  // ) {
  //   const dialog = this.dialogService.open(c, {
  //     data,
  //     width: additional?.width,
  //     height: additional?.height,

  //     style: {
  //       maxHeight: '100dvh',
  //       maxWidth: '100vw',
  //     },
  //     position: additional?.position || this.dialogPosition(),
  //     showHeader: additional?.header ? true : false,
  //     header: additional?.header || '',
  //   });
  //   this.hijackPrimeDialog(dialog);
  //   return dialog;
  // }

  /**
   * @param header
   * @param msg
   * @returns
   */
  confirm(
    header: TranslatorText,
    msg: TranslatorText
  ): Observable<boolean | null | undefined> {
    return this.webdialogHandler
      .open(ConfirmDialogComponent, {
        title: header,
        displayCloseButton: false,
        defaultOutValue: false,
        position: this.dialogPosition(),
        data: {
          message: msg,
        } as ConfirmConfig,
      })
      .onClose();
    // // this.insertBackButtonFlag();
    // return new Observable((subscriber) => {
    //   const next = (b: boolean) => {
    //     subscriber.next(b);
    //     subscriber.complete();
    //   };
    //   const dialRef = this.insertBackButtonFlag((value) => {
    //     next(value);
    //     this.confirmationService.close();
    //   });
    //   this.confirmationService.confirm({
    //     message: this.translator.getString(msg),
    //     header: this.translator.getString(header),
    //     acceptLabel: this.translator.getString('mona.yes'),
    //     rejectLabel: this.translator.getString('mona.no'),

    //     icon: 'pi pi-exclamation-triangle',
    //     accept: () => {
    //       dialRef.closeMainAction(true, !navigationOnAccept);
    //     },
    //     reject: () => {
    //       dialRef.closeMainAction(false, !navigationOnReject);
    //     },
    //   });
    // });
  }

  alert(
    title: TranslatorText,
    description: TranslatorText,
    type: 'info' | 'success' | 'warn' | 'error' | 'neutral',
    disableAutoClose = false,
    key?: string
  ) {
    this.messageService.add({
      severity: type,
      summary: this.translator.getString(title),
      detail: this.translator.getString(description),
      sticky: disableAutoClose,
      key,
    });
  }
  removeAllAlerts() {
    this.messageService.clear();
  }
  removeAlertByKey(key: string) {
    this.messageService.clear(key);
  }

  textInputBasic(
    title: TranslatorText,
    initialValue = '',
    longTextMode = false
  ) {
    const dialog = this.webdialogHandler.open<any, string>(
      BasicTextInputDialogComponent,
      {
        data: {
          initialValue,
          longTextMode,
        },
        title: this.translator.getString(title),
        position: this.dialogPosition(),
        defaultOutValue: '',
      }
    );

    return dialog.onClose();
  }

  textInputCodeEditor(
    title: TranslatorText,
    language: string,
    initialValue = ''
  ) {
    const dialog = this.webdialogHandler.open(
      CodeEditorTextInputDialogComponent,
      {
        data: { language, initialValue },
        width: '100%',
        height: '100%',
        title: this.translator.getString(title),
        position: this.dialogPosition(),
        defaultOutValue: initialValue,
      }
    );

    return dialog.onClose();
  }

  reformDialog(
    reform: Reform,
    header: TranslatorText,
    extraCheckError: () => TranslatorText | null = () => null
  ) {
    const dialog = this.webdialogHandler.open(ReformDialogComponent, {
      data: { reform, extraCheckError },
      title: header,
      position: this.dialogPosition(),
      defaultOutValue: false,
    });

    return dialog.onClose();
  }

  insertBackButtonFlag(
    a: (value?: any) => void,
    defaultValue?: any
  ): DialogVisibilityReference {
    return generateMobileOptimizedDialogHideController(a, defaultValue);
  }
}
