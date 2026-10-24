import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ReportSetupComponent, ReportSetupDialogData } from './report-setup.component';

@Injectable({ providedIn: 'root' })
export class ReportSetupWizardService {
  private readonly overlay = inject(BasicOverlayService);

  open(data: ReportSetupDialogData = {}): Observable<boolean | null | undefined> {
    return this.overlay.showComponentAsDialog<ReportSetupDialogData, boolean>(ReportSetupComponent, {
      title: 'postral.report-setup.title',
      data,
      width: '560px',
      displayCloseButton: false,
      dissmissOnClickMask: false,
      defaultOutValue: false,
    }).onClose();
  }
}
