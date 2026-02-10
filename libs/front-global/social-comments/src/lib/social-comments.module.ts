import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from './service/comment.service';
import { SocialCommentsComponent } from './component/social-comments/social-comments.component';
import { FormsModule } from '@angular/forms';
import { SocialCommentsBottomBarComponent } from './component/social-comments-bottom-bar/social-comments-bottom-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MenuModule } from 'primeng/menu';
import { SingleCommentComponent } from './component/single-comment/single-comment.component';
import { CommentTextboxComponent } from './component/comment-textbox/comment-textbox.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { FrontGlobalMarkdownEditorModule } from '@lotus/front-global/markdown-editor';
import { RouterModule } from '@angular/router';
import { CommentDialogComponent } from './component/comment-dialog/comment-dialog.component';
import { OverlayService } from 'primeng/api';
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
    InputTextModule,
    FrontGlobalButtonModule,
    MenuModule,
    OverlayPanelModule,
    UbsTranslatorNgxModule,
    FrontGlobalMarkdownEditorModule,
    RouterModule,
    WebdialogComponent,
  ],
  exports: [
    SocialCommentsComponent,
    SocialCommentsBottomBarComponent,
    SingleCommentComponent,
  ],
  providers: [CommentService, BasicOverlayService, WebdialogHandler],
})
export class SocialCommentsModule {}
