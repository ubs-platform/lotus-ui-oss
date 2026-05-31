import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { SocialCommentsModule } from '@lotus/front-global/social-comments';
import { BookCommentsComponent } from './book-comments/book-comments.component';
import { BookCommentsRoutingModule } from './routing.module';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { WebdialogComponent } from '../../../../front-global/webdialog/src/lib/webdialog/webdialog.component';
import { FrontGlobalPromptOverlaysModule } from '@lotus/front-global/prompt-overlays';
import { AdminSocialOptionsComponent } from "@lotus/front-global/admin-social-options";
import { OnpageHeaderComponent } from "@lotus/front-global/dynamic-headers";
@NgModule({
  declarations: [BookCommentsComponent],
  imports: [
    CommonModule,
    SocialCommentsModule,
    FrontGlobalButtonModule,
    RouterModule,
    BookCommentsRoutingModule,
    FrontGlobalTableModule,
    WebdialogComponent,
    FrontGlobalPromptOverlaysModule,
    WebdialogComponent,
    AdminSocialOptionsComponent,
    OnpageHeaderComponent
],
  exports: [BookCommentsComponent],
  providers: [],
})
export class BookCommentsModule {}
