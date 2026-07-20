import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LexicalMarkdownEditorComponent } from './components/markdown-editor/lexical-markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { IconComponent } from "@lotus/front-global/icon";
@NgModule({
  imports: [CommonModule, FormsModule, FrontGlobalButtonModule, IconComponent],
  declarations: [LexicalMarkdownEditorComponent],
  exports: [LexicalMarkdownEditorComponent],
})
export class FrontGlobalMarkdownEditorModule {}
