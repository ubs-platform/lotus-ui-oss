import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { TableModule } from 'primeng/table';
import { ColumnComponent } from './components/column/column.component';
import { DataDirective } from './directives/data.drective';
import { HeaderDirective } from './directives/header.drective';
import { SearchableDataTableComponent } from './components/searchable-data-table/searchable-data-table.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalPromptOverlaysModule } from '../../../prompt-overlays/src/lib/front-global-prompt-overlays.module';
import { EmptyDataDirective } from './directives/empty-data.directive';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FrontGlobalButtonModule,
    FrontGlobalPromptOverlaysModule,
  ],
  declarations: [
    TableComponent,
    ColumnComponent,
    DataDirective,
    HeaderDirective,
    SearchableDataTableComponent,
    EmptyDataDirective
  ],
  exports: [
    TableComponent,
    ColumnComponent,
    DataDirective,
    HeaderDirective,
    SearchableDataTableComponent,
    EmptyDataDirective
  ],
})
export class FrontGlobalTableModule {}
