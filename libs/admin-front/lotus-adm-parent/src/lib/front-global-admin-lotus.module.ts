import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { frontGlobalAdminLotusRoutes } from './lib.routes';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MessageModule } from 'primeng/message';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { FrontGlobalUiPageContainerModule } from '@lotus/front-global/ui/page-container';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalSidebarModule,
    UbsTranslatorNgxModule,
    // FrontGlobalAdminUsersModule, what a silly behavior 🤡
    MessageModule,
    RouterModule.forChild(frontGlobalAdminLotusRoutes),
    FrontGlobalUiPageContainerModule,
  ],
  declarations: [MainPageComponent],
})
export class AdminFrontLotusParentModule {}
