import { ChangeDetectorRef, Component, Inject, input, model } from '@angular/core';

import {
  CommentAddDTO,
  CommentDTO,
  CommentSearchDTO,
} from '@ubs-platform/social-common';
import { CommentService } from '../../service';
import { AuthManagementService } from '@lotus/front-global/auth';
import { UserDTO } from '@ubs-platform/users-common';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
  selector: 'lib-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss',
  standalone: false,
})
export class CommentDialogComponent {
  user?: UserDTO;
  readonly currentCommentText = model('');
  isChild: string | undefined;

  constructor(
    public ref: WebdialogReference<CommentDTO | null>,
    @Inject(WEBDIALOG_CONFIG)
    public config: IWebDialogConfig<CommentSearchDTO, CommentDTO | null>,
    private commentService: CommentService,
    private auth: AuthManagementService,
    private overlayService: BasicOverlayService,
    private cd: ChangeDetectorRef
  ) {
    this.auth.userChange().subscribe((user) => {
      this.user = user!;
    });
    this.isChild = this.config.data?.childOfCommentId;
  }

  closeDialog() {
    this.ref.close(null);
  }

  sendComment() {
    const currentCommentText = this.currentCommentText();
    if (currentCommentText) {
      // İçerik filtreleme artık sunucuda (UBS social-webservice pattern filtresi).
      // Reddedilen yorumlar hata döner, sessizce düşenler 200 döner ve burada normal akış gibi görünür.
      this.commentService
        .addComment({
          ...(this.config.data! as CommentAddDTO),
          textContent: currentCommentText,
        })
        .subscribe({
          next: (a) => this.ref.close(a),
          error: (err) => {
            if (err?.status === 400) {
              this.overlayService.alert(
                'Yorumunuz yayınlanamadı',
                'Yorum, topluluk kurallarına uymadığı için kabul edilmedi.',
                'warn'
              );
            } else if (err?.status === 401 || err?.status === 403) {
              this.overlayService.alert(
                'Yorum yapamazsınız',
                'Yorum yapma yetkiniz şu anda kapalı.',
                'warn'
              );
            }
          },
        });
    }
  }
}
