import { ChangeDetectorRef, Component, Inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
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
      const clc = currentCommentText.toLowerCase();
      // Yandaş değilim, sadece bu yorumu yaparak hepimizin başı yansın istemiyorum
      if (clc.includes("tayyip") || clc.includes("tayyib") || clc.includes("erdoğan") || clc.includes("erdogan") || clc.includes("akp")) {
        // Undertale easter egg
        this.overlayService.alert("Çok fazla köpek taşıyorsun", "", "warn")
        this.ref.close(null);

      } else {
        this.commentService
          .addComment({
            ...(this.config.data! as CommentAddDTO),
            textContent: currentCommentText,
          })
          .subscribe((a) => {
            this.ref.close(a);
          });
      }
      // this.dialogHideReference?.closeMainAction();

    }
  }
}
