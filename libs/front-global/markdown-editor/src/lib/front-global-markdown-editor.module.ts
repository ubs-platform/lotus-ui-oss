import { NgModule, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { MarkdownBlockMathComponent } from './components/markdown-block-math/markdown-block-math.component';
import { MilkdownMathInService } from './components/markdown-editor/milkdown-math-inservice';
@NgModule({
  imports: [CommonModule, FormsModule, FrontGlobalButtonModule],
  declarations: [MarkdownEditorComponent, MarkdownBlockMathComponent],
  exports: [MarkdownEditorComponent],
  providers: [MilkdownMathInService],
})
export class FrontGlobalMarkdownEditorModule {}
