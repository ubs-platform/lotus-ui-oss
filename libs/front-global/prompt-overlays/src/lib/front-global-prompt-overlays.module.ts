import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { BasicTextInputDialogComponent } from './component/basic-text-input-dialog/basic-text-input-dialog.component';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CodeEditorTextInputDialogComponent } from './component/code-editor-input-dialog.component/code-editor-input-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { InstantHtmlComponent } from './component/instant-html/instant-html.component';
import { InstantModalComponent } from './component/instant-modal/instant-modal.component';
import { BasicOverlayService } from './service';
import { ReformDialogComponent } from './component/reform-dialog/reform-dialog.component';
import { ReformNgxPrimeComponent } from 'libs/front-global/minky/reform-ngx-prime/src/lib/reform-ngx-prime/reform-ngx-prime.component';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';

@NgModule({
  imports: [
    CommonModule,
    UbsTranslatorNgxModule,
    FrontGlobalButtonModule,
    InputTextModule,
    FormsModule,
    MonacoEditorModule,
    MinkyReformNgxPrimeModule,
  ],
  declarations: [
    ConfirmDialogComponent,
    BasicTextInputDialogComponent,
    CodeEditorTextInputDialogComponent,
    InstantModalComponent,
    InstantHtmlComponent,
    ReformDialogComponent,
  ],
  exports: [InstantModalComponent, ReformDialogComponent],
  providers: [BasicOverlayService],
})
export class FrontGlobalPromptOverlaysModule {}
