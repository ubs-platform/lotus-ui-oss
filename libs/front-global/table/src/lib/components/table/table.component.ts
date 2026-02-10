import {
  AfterViewInit,
  Component,
  computed,
  contentChildren,
  ContentChildren,
  input,
  Input,
  OnInit,
  QueryList,
  signal,
} from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { ArrayToObjectUtil } from '@lotus/front-global/array-to-object';
import { NgxMobileExperienceUtil } from '@lotus/front-global/mona-mobile-experience-ng';
import { DialogInformation } from '@lotus/front-global/webdialog';
import { DataDirective } from '../../directives/data.drective';
import { EmptyDataDirective } from '../../directives/empty-data.directive';
@Component({
  selector: 'ubs-table-ngx',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: false,
})
export class TableComponent implements AfterViewInit {
  testo(arg0: any) {
    console.info(arg0)
  }
  columnsContent = contentChildren(ColumnComponent);
  cols = computed(() => ArrayToObjectUtil.groupBySpecialCondition(
    this.columnsContent() as ColumnComponent[],
    a => a.name()
  ));
  colsKeys = computed(() => this.columnsContent().map((a) => a.name()));
  items = input<any[]>([]);
  isOnMobile = DialogInformation.onMobileAsync;
  cover = input(false);
  noDataTemplateDirective = contentChildren(EmptyDataDirective);


  ngAfterViewInit(): void { }


  // ngOnInit(): void {
  //   this.colsKeys.set(this.populateColKeys());
  //   this.cols.set(this.populateColObj());
  // }
}
