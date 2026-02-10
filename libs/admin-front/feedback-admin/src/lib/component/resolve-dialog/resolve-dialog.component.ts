import { Component } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { ResolveForm } from '../../forms/resolve.form';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'lotus-web-resolve-dialog',
    templateUrl: './resolve-dialog.component.html',
    standalone: false
})
export class ResolveDialogComponent {
  reform = new Reform<ResolveForm>(ResolveForm);
  id?: string;

  /**
   *
   */
  constructor(
    private userMsgService: UserMessageService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig<string>
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.id = this.dialogConfig.data;
  }

  submit() {
    if (this.id) {
      if (this.reform.allValidationErrors().length) {
      } else {
        this.userMsgService
          .resolve(this.id, this.reform.value)
          .subscribe((a) => {
            this.dialogRef.close(a);
          });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
