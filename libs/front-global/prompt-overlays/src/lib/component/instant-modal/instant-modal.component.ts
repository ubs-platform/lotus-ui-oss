import {
  Component,
  ElementRef,
  Inject,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InstantModalOptions } from '../../model/instant-modal-options.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';

@Component({
  selector: 'lib-instant-modal',
  templateUrl: './instant-modal.component.html',
  styleUrl: './instant-modal.component.scss',
  standalone: false,
})
export class InstantModalComponent {
  data?: InstantModalOptions;
  safeUrl?: any;
  parent = viewChild<ElementRef<HTMLDivElement>>('parent');
  contentLoaded = new ReplaySubject<void>(1);
  closed = false;

  constructor(
    public dial: WebdialogReference<boolean>,
    protected _sanitizer: DomSanitizer,
    // private dialogConfig: DynamicDialogConfig<InstantModalOptions>
    @Inject(WEBDIALOG_CONFIG)
    private dialogConfig: IWebDialogConfig<InstantModalOptions, boolean>
  ) {
    this.data = this.dialogConfig.data;
    if (this.data?.url) {
      this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.data.url
      );
    }
  }

  closeDialog(arg0: boolean) {
    this.closed = true;
    this.dial.close(arg0);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.contentLoaded.subscribe(() => {
      this.parent()!.nativeElement.scrollTop = 0;
    });
  }
}
