import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { FrontGlobalAppEssentialModule } from '@lotus/front-global/app-essential';
import { FrontGlobalSidebarModule } from '@lotus/front-global/sidebar';
import { FrontGlobalUiPageContainerModule } from '@lotus/front-global/ui/page-container';
import { MessageModule } from 'primeng/message';
import { LogoAreaComponent } from './components/logo-area/logo-area.component';
import { AppRoutingModule } from "apps/admin/tk-santral/src/app/app-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FrontGlobalAppEssentialModule,
    FrontGlobalSidebarModule,
    FrontGlobalUiPageContainerModule,
    MessageModule,
    AppRoutingModule
],
  declarations: [AdminHeaderComponent, LogoAreaComponent],
  exports: [AdminHeaderComponent, LogoAreaComponent],
})
export class AdminFrontCommonModule {}
