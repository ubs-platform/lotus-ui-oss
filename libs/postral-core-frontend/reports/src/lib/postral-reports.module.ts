import { NgModule, Query } from "@angular/core";
import { QueryListComponent } from "./query-list/query-list.component";
import { ReportInfoComponent } from "./report-info/report-info.component";
import { QueryInfoComponent } from "./query-info/query-info.component";
import { ReportListComponent } from "./report-list/report-list.component";
import { FrontGlobalButtonModule } from "@lotus/front-global/button";
import { ReformDataEditComponent } from "@lotus/front-global/reform-data-edit";
import { FrontGlobalStatusBadgeModule } from '@lotus/front-global/status-badge';
import { FrontGlobalTableModule } from "@lotus/front-global/table";
import { DatePipe, DecimalPipe } from "@angular/common";
import { DataListLayoutModule } from "@lotus/front-global/ui/data-list-layout";
import { UbsTranslatorNgxModule } from "@ubs-platform/translator-ngx";
import { TooltipModule } from 'primeng/tooltip';
import { MoneyDisplayComponent } from './money-display/money-display.component';
@NgModule({
  declarations: [QueryListComponent, QueryInfoComponent, ReportInfoComponent, ReportListComponent, MoneyDisplayComponent],
  exports: [QueryListComponent, QueryInfoComponent, ReportInfoComponent, ReportListComponent, MoneyDisplayComponent],
  imports: [FrontGlobalButtonModule, ReformDataEditComponent,
    FrontGlobalStatusBadgeModule, FrontGlobalTableModule,
    DecimalPipe, DatePipe, DataListLayoutModule, UbsTranslatorNgxModule,
    TooltipModule],
  providers: [DecimalPipe, DatePipe]
})
export class PostralReportsModule { }