import { Component, Inject } from '@angular/core';
import { GlobalVariableService } from '../../service/global-variable.service';
import { Reform } from '@lotus/front-global/minky/core';
import { GlobalVariableWriteForm } from '../../form/global-variable-write.form';
import { GlobalVariableWriteDTO } from '@ubs-platform/notify-common';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';

@Component({
    selector: 'lotus-web-global-variable-change-modal',
    templateUrl: './global-variable-change-modal.component.html',
    styleUrls: ['./global-variable-change-modal.component.scss'],
    standalone: false
})
export class GlobalVariableChangeModalComponent {
  // newValue = '';
  reform!: Reform<GlobalVariableWriteForm>;

  constructor(
    public ref: WebdialogReference<void>,
    @Inject(WEBDIALOG_CONFIG)
    public config: IWebDialogConfig<
      GlobalVariableWriteDTO & {
        _otherLanguages: string[];
        _otherNames: string[];
      },
      void
    >,
    private gbService: GlobalVariableService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.newValue = this.config.data!.value || '';

  }
  saveValue() {
    // const writeInf = this.config.data!;
    if (!this.reform.allValidationErrors().length) {
      const value = this.reform.value;
      this.gbService.edit(value).subscribe(() => {
        this.ref.close();
      });
    }
    // this.gbService.edit({
    //   // language: writeInf.language,
    //   // value: this.newValue,
    //   // name: writeInf.name,
    // });
  }
}
