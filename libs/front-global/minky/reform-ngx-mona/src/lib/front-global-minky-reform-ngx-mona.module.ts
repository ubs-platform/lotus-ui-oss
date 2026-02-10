import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorInputComponent } from './component/code-editor-input/code-editor-input.component';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MessageModule } from 'primeng/message';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { FrontGlobalMarkdownEditorModule } from '@lotus/front-global/markdown-editor';
import { MarkdownEditorInputComponent } from './component/markdown-editor-input/markdown-editor-input.component';

@NgModule({
  imports: [
    CommonModule,
    MinkyReformNgxModule,
    FrontGlobalButtonModule,
    MonacoEditorModule.forRoot(),
    MessageModule,
    EditorModule,
    FormsModule,
    UbsTranslatorNgxModule,
    FrontGlobalMarkdownEditorModule,
  ],
  declarations: [CodeEditorInputComponent, MarkdownEditorInputComponent],
  exports: [CodeEditorInputComponent, MarkdownEditorInputComponent],
})
export class FrontGlobalMinkyReformNgxMonaModule {}
