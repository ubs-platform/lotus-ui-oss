import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { RouterModule } from '@angular/router';
import { rota } from './lib.routes';
import { TableModule } from 'primeng/table';
import { UserCardComponent } from './components/user-card/user-card.component';
import { MenuModule } from 'primeng/menu';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { PredefinedDataManager } from '@lotus/front-global/predefined-data';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { FrontGlobalImagesModule } from '@lotus/front-global/images';
import { CommentAdminService } from '@lotus/front-global/social-comments';
import { WebdialogComponent } from '../../../../front-global/webdialog/src/lib/webdialog/webdialog.component';
import { AdminSocialOptionsComponent } from '@lotus/front-global/admin-social-options';
import { UserAdminService } from '@lotus/front-global/auth';
import { OnmobileHeaderComponent, OnpageHeaderComponent } from "@lotus/front-global/dynamic-headers";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(rota),
    TableModule,
    MenuModule,
    FrontGlobalButtonModule,
    MinkyReformNgxPrimeModule,
    FrontGlobalTableModule,
    UbsTranslatorNgxModule,
    FrontGlobalImagesModule,
    WebdialogComponent,
    AdminSocialOptionsComponent,
    OnmobileHeaderComponent,
    OnpageHeaderComponent
],
  declarations: [UsersPageComponent, UserCardComponent, UserDetailsComponent],
  exports: [UsersPageComponent],
  providers: [UserAdminService, PredefinedDataManager, CommentAdminService],
})
export class AdminFrontUserModule {}
