import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericAppHeaderComponent } from './generic-app-header/generic-app-header.component';
import { MenuModule } from 'primeng/menu';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { ChipModule } from 'primeng/chip';
import { FrontGlobalAuthLoginViewsModule } from '@lotus/front-global/auth-login-views';
import { RouterModule } from '@angular/router';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import {
  LANGUAGE_JSON_URL,
  UbsTranslatorNgxModule,
} from '@ubs-platform/translator-ngx';
import { FrontGlobalDebugToolsModule } from '@lotus/front-global/debug-tools';
import { ApplicationLogoDirective } from './application-logo.directive';
import { ApplicationFooterDirective } from './application-footer.directive';
import { PwaUpdateVersionComponent } from '@lotus/front-global/pwa-update-version';
import { TooltipModule } from 'primeng/tooltip';
import { WebdialogComponent } from '@lotus/front-global/webdialog';
import { OnmobileHeaderComponent, OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    SplitButtonModule,
    PanelMenuModule,
    InputTextModule,
    ToolbarModule,
    DynamicDialogModule,
    MessageModule,
    ToastModule,
    MessageModule,
    SidebarModule,
    FrontGlobalAuthLoginViewsModule,
    ChipModule,
    RouterModule,
    FrontGlobalButtonModule,
    UbsTranslatorNgxModule,
    FrontGlobalDebugToolsModule,
    PwaUpdateVersionComponent,
    TooltipModule,
    WebdialogComponent,
    OnmobileHeaderComponent,
    OnpageHeaderComponent
],
  declarations: [
    GenericAppHeaderComponent,
    ApplicationLogoDirective,
    ApplicationFooterDirective,
  ],
  exports: [
    GenericAppHeaderComponent,
    ApplicationLogoDirective,
    ApplicationFooterDirective,
  ],
  providers: [],
})
export class FrontGlobalAppEssentialModule {}
