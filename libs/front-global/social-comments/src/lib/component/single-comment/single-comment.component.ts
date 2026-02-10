import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  viewChild,
  ViewChild,
  input,
  model
} from '@angular/core';
import { Menu } from 'primeng/menu';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { EnvironmentController } from '@ubs-platform/translator-core';
import { Reform } from '@lotus/front-global/minky/core';
import { FlagForm } from '../../forms/flag.form';
import { FeedbackDialogService } from '@lotus/front-global/feedback-dialog';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { AuthManagementService } from '@lotus/front-global/auth';
import { UserDTO } from '@ubs-platform/users-common';
import { CommentDTO, CommentSearchDTO } from '@ubs-platform/social-common';
import { CommentService } from '../../service/comment.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'lib-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrl: './single-comment.component.scss',
  standalone: false,
})
export class SingleCommentComponent implements OnChanges, OnInit {

  readonly item = model<CommentDTO>();
  readonly showOptions = input(false);
  creationDate: string = '';
  editDate: string = '';
  @Output() commentRemoval = new EventEmitter();
  @ViewChild("extraOptions") extraOptionsView?: OverlayPanel;
  menus: any[] = [];
  language: string = '';
  commentIsDownVoted = false;
  showAnswers = false;
  user?: UserDTO;
  childCommentsParentDiv = viewChild<ElementRef<HTMLDivElement>>(
    'childCommentsParentDiv'
  );
  existCommentAbility: any;

  constructor(
    private commentService: CommentService,
    private overlay: BasicOverlayService,
    private umessageService: UserMessageService,
    private authService: AuthManagementService
  ) { }

  toggleExistCommentAbilities(clickEvent: MouseEvent) {
    this.commentService.checkExistCommentAbility(this.item()!._id).subscribe(a => {
      this.existCommentAbility = a;
      this.extraOptionsView?.toggle(clickEvent);
    })
    // 
  }


  ngOnInit(): void {
    this.updateDownvoted();
    this.authService.userChange().subscribe((a) => {
      this.user = a!;
    });
  }

  showAddAnswerDialogForThatComment() {
    const dial = this.overlay.showComponentAsDialog(CommentDialogComponent, {
      data: {
        entityGroup: this.item()!.entityGroup,
        childEntityId: this.item()!.childEntityId,
        childEntityName: this.item()!.childEntityName,
        childOfCommentId: this.item()!._id,
        mainEntityId: this.item()!.mainEntityId,
        mainEntityName: this.item()!.mainEntityName,
      } as CommentSearchDTO,
      position: 'bottom-center',
      defaultOutValue: null,
    });
    dial.onClose().subscribe((a) => {
      if (a) {
        this.showAnswers = true;
        this.highlightChildren();
      }
    });
  }

  private highlightChildren() {
    setTimeout(() => {
      this.childCommentsParentDiv()?.nativeElement.scrollIntoView();
    }, 200);
  }

  toggleChildren() {
    this.showAnswers = !this.showAnswers;
    this.highlightChildren();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      EnvironmentController.getEnvironmentController()
        .getLanguage()
        .subscribe((lang) => {
          this.language = lang;
          this.creationDate = this.dateFormat(this.item()!.creationDate);
          this.editDate = this.dateFormat(this.item()!.lastEditDate);
        });
    }
  }
  dateFormat(creationDate: Date | undefined): string {
    return new Date(creationDate as any).toLocaleDateString(this.language, {
      year: 'numeric',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  deleteComment() {
    this.overlay
      .confirm('Yorumu sil', 'Gerçekten yorumu silmek istiyor musunuz')
      .subscribe((a) => {
        if (a) {
          this.commentService.deleteComment(this.item()!._id).subscribe(() => {
            this.commentRemoval.emit(this.item());
          });
        }
      });
  }

  editComment() {
    this.overlay
      .textInputBasic(
        'Yeni yorumunuzu girin',
        this.item()!.textContent as string,
        true
      )
      .subscribe((newCommentText) => {
        if (newCommentText) {
          this.commentService
            .editComment(this.item()!._id, newCommentText as string)
            .subscribe((newComment) => {
              this.item.set(newComment);
            });
        }
      });
  }

  downvote() {
    this.commentService.downvote(this.item()!._id).subscribe((a) => {
      this.item.set(a);
      this.updateDownvoted();
    });
  }
  private updateDownvoted() {
    this.commentIsDownVoted = this.item()!.votesLength < 0;
  }

  upvote() {
    this.commentService.upvote(this.item()!._id).subscribe((a) => {
      this.item.set(a);
      this.updateDownvoted();
    });
  }

  blockUser() {
    this.overlay
      .confirm('mona.comments.block', 'mona.comments.block-question')
      .subscribe((a) => {
        if (a) {
          this.commentService.blockUser(this.item()!).subscribe(() => {
            this.item()!.userBanned = true;
          });
        }
      });
  }

  unblockUser() {
    this.overlay
      .confirm('mona.comments.unblock', 'mona.comments.unblock-question')
      .subscribe((a) => {
        if (a) {
          this.commentService.unblockUser(this.item()!).subscribe(() => {
            this.item()!.userBanned = false;
          });
        }
      });
  }

  flag() {
    const reform = new Reform<FlagForm>(FlagForm, new FlagForm());
    this.overlay.reformDialog(reform, 'İçeriği bildir').subscribe((a) => {
      if (a) {
        const item = this.item();
        this.umessageService
          .create({
            email: 'social@tetakent.com',
            firstName: 'Lotus',
            lastName: 'System',
            type: 'CONTENT_REPORT',
            summary: this.user
              ? `${this.user.id} tarafından yapılan yorum bildirimi`
              : 'Anonim yorum bildirimi',
            message: `Yorum yapan: ${item?.byFullName} (${item?.byUserId}) <br> Yorum: ${item?.textContent}  <br>  Yorum id: ${item?._id} <br> Kullanıcı şikayeti: ${reform.value.contentType} <br> Ekstra not: ${reform.value.extraNotes}
            `,
          })
          .subscribe((a) => {
            this.overlay.alert(
              'Yorumunuz bildirildi',
              'Bildiriniz için teşekkür ederiz. En yakın zamanda inceleyeceğiz',
              'info'
            );
          });
      }
    });
  }
}
