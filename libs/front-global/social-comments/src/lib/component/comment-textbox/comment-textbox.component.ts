import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  input
} from '@angular/core';
import { AuthManagementService } from '@lotus/front-global/auth';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CommentDTO, CommentSearchDTO } from '@ubs-platform/social-common';
import { UserDTO } from '@ubs-platform/users-common';
import { OverlayService } from 'primeng/api';
import { DialogVisibilityReference } from '@lotus/front-global/webdialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'lib-comment-textbox',
  templateUrl: './comment-textbox.component.html',
  styleUrl: './comment-textbox.component.scss',
  standalone: false,
})
export class CommentTextboxComponent implements AfterViewInit {
  @Output() sendComment = new EventEmitter<CommentDTO>();
  readonly isChild = input<boolean | string | String>(false);
  readonly baseSearch = input.required<CommentSearchDTO>();
  user: UserDTO | null | undefined;

  constructor(private overlayService: BasicOverlayService, private auth: AuthManagementService) {
    this.auth.userChange().subscribe(a => {
      this.user = a;
    })
  }

  ngAfterViewInit(): void {
    // this.dialogPosition = innerWidth > 992 ? 'center' : 'bottom';
    // this.cd.detectChanges();
  }

  // showCommentTypeDialog() {
  //   this.dialogVisible = true;
  //   this.dialogHideReference = this.overlayService.insertBackButtonFlag(() => {
  //     this.dialogVisible = false;
  //   });
  // }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  sndCmtEvnt() {}

  showDialog() {
    const dial = this.overlayService.showComponentAsDialog(
      CommentDialogComponent,
      {
        defaultOutValue: null,
        data: this.baseSearch(),
        position: 'bottom-center',
        title: this.user?.name + " " + this.user?.surname + " olarak yorum yap"
      }
    );
    dial.onClose().subscribe((a) => {
      if (a) {
        this.sendComment.emit(a);
      }
    });
  }

  textboxKeyboardEvent($event: KeyboardEvent) {
    if ($event.altKey && $event.key == 'Enter') {
      this.sndCmtEvnt();
    }
  }
}
