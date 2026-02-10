import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rota } from './lib.routes';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalTableModule } from '@lotus/front-global/table';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { MessageModule } from 'primeng/message';
import { TemplateListComponent } from './component/template-list/template-list.component';
import { TemplateEditorComponent } from './component/template-editor/template-editor.component';
import { GlobalVariableEditorComponent } from './component/global-variable-editor/global-variable-editor.component';
import { GlobalVariableService } from './service/global-variable.service';
import { GlobalVariableChangeModalComponent } from './component/global-variable-change-modal/global-variable-change-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { TemplateService } from './service/template.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ChangeableTextComponent } from '@lotus/front-global/changeable-text';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(rota),
    UbsTranslatorNgxModule,
    FrontGlobalTableModule,
    FrontGlobalButtonModule,
    MinkyReformNgxPrimeModule,
    MessageModule,
    EditorModule,
    FormsModule,
    InputTextModule,
    MinkyReformNgxModule,
    MonacoEditorModule.forRoot(),
    ChangeableTextComponent,
    FrontGlobalMinkyReformNgxMonaModule,
  ],
  declarations: [
    TemplateListComponent,
    TemplateEditorComponent,
    GlobalVariableEditorComponent,
    GlobalVariableChangeModalComponent,
  ],
  providers: [DialogService, GlobalVariableService, TemplateService],
  exports: [GlobalVariableChangeModalComponent],
})
export class AdminFrontNotifyModule {}
