import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarMenuComponent } from './components/sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarModule } from 'primeng/sidebar';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { ButtonModule } from 'primeng/button';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
import { IconComponent } from "@lotus/front-global/icon";

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    UbsTranslatorNgxModule,
    ButtonModule,
    FrontGlobalButtonModule,
    OnpageHeaderComponent,
    IconComponent
],
  declarations: [SidebarComponent, SidebarMenuComponent],
  exports: [SidebarComponent],
})
export class FrontGlobalSidebarModule {}
