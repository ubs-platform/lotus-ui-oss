import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugKeyValueViewComponent } from './component/debug-key-value-view/debug-key-value-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { UconsoleService } from './service/uconsole.service';
import { DebugKeyValueViewComponentService } from './service/debug-kv-component-dialog.service';

@NgModule({
  imports: [CommonModule],
  declarations: [DebugKeyValueViewComponent],
  exports: [DebugKeyValueViewComponent],
  providers: [
    DialogService,
    UconsoleService,
    DebugKeyValueViewComponentService,
  ],
})
export class FrontGlobalDebugToolsModule {}
