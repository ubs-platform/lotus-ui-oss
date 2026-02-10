import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSanitizePipe } from './md-sanitize.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [MdSanitizePipe],
  exports: [MdSanitizePipe],
})
export class FrontGlobalMarkdownSanitizerModule {}
