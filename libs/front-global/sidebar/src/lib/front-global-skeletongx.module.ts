import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarMenuComponent } from './components/sidebar/sidebar-menu/sidebar-menu.component';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
import { IconComponent } from "@lotus/front-global/icon";
import { PTooltipDirective } from "@lotus/front-global/overlay-panel";

@NgModule({
  imports: [
    CommonModule,
    UbsTranslatorNgxModule,
    FrontGlobalButtonModule,
    OnpageHeaderComponent,
    IconComponent,
    PTooltipDirective
  ],
  declarations: [SidebarComponent, SidebarMenuComponent],
  exports: [SidebarComponent],
})
export class FrontGlobalSidebarModule { }
