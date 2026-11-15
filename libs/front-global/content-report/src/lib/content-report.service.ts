import { Injectable, inject } from '@angular/core';
import { Observable, of, switchMap, map } from 'rxjs';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { FlagForm } from './flag.form';
import { DEFAULT_REASONS } from './content-report-reasons';
import { ContentReportRequest } from './content-report.models';

const REPORT_EMAIL = 'social@tetakent.com';

@Injectable()
export class ContentReportService {
  private overlay = inject(BasicOverlayService);
  private userMessageService = inject(UserMessageService);

  /**
   * Opens the reason dialog and, if confirmed, sends a CONTENT_REPORT message.
   * Emits true when the report was sent, false when the dialog was cancelled.
   */
  report(request: ContentReportRequest): Observable<boolean> {
    debugger;
    const reform = new Reform<FlagForm>(FlagForm, new FlagForm(), {
      parameters: {
        reasons: request.reasons ?? DEFAULT_REASONS[request.entityType],
      },
    });

    return this.overlay
      .reformDialog(reform, request.dialogTitle ?? 'İçeriği bildir')
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return of(false);
          return this.userMessageService
            .create({
              email: REPORT_EMAIL,
              firstName: 'Lotus',
              lastName: 'System',
              type: 'CONTENT_REPORT',
              relatedUrl: location.href,
              summary: this.summary(request),
              message: this.message(request, reform.value),
            })
            .pipe(
              map(() => {
                this.overlay.alert(
                  'Bildiriminiz alındı',
                  'Bildiriniz için teşekkür ederiz. En yakın zamanda inceleyeceğiz',
                  'info'
                );
                return true;
              })
            );
        })
      );
  }

  private summary(request: ContentReportRequest) {
    const subject = {
      COMMENT: 'yorum',
      BOOK: 'kitap',
      QUESTION: 'soru',
    }[request.entityType];
    return request.reporterUserId
      ? `${request.reporterUserId} tarafından yapılan ${subject} bildirimi`
      : `Anonim ${subject} bildirimi`;
  }

  private message(request: ContentReportRequest, form: FlagForm) {
    return [
      `İçerik tipi: ${request.entityType}`,
      `İçerik id: ${request.entityId}`,
      ...(request.contextLines ?? []),
      `Kullanıcı şikayeti: ${form.contentType}`,
      `Ekstra not: ${form.extraNotes}`,
    ].join(' <br> ');
  }
}
