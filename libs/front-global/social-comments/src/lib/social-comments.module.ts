import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from './service/comment.service';
import { SocialCommentsComponent } from './component/social-comments/social-comments.component';
import { FormsModule } from '@angular/forms';
import { SocialCommentsBottomBarComponent } from './component/social-comments-bottom-bar/social-comments-bottom-bar.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { SingleCommentComponent } from './component/single-comment/single-comment.component';
import { CommentTextboxComponent } from './component/comment-textbox/comment-textbox.component';
import { OverlayPanelComponent } from '@lotus/front-global/overlay-panel';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobalMarkdownEditorModule } from '@lotus/front-global/markdown-editor';
import { RouterModule } from '@angular/router';
import { CommentDialogComponent } from './component/comment-dialog/comment-dialog.component';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { WebdialogComponent } from '../../../webdialog/src/lib/webdialog/webdialog.component';
import { WebdialogHandler } from '@lotus/front-global/webdialog';

@NgModule({
  declarations: [
    SocialCommentsComponent,
    SocialCommentsBottomBarComponent,
    SingleCommentComponent,
    CommentTextboxComponent,
    CommentDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    FrontGlobalMarkdownEditorModule,
    RouterModule,
    WebdialogComponent,
    OverlayPanelComponent,
  ],
  exports: [
    SocialCommentsComponent,
    SocialCommentsBottomBarComponent,
    SingleCommentComponent,
  ],
  providers: [CommentService, BasicOverlayService, WebdialogHandler],
})
export class SocialCommentsModule {}
