import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { ColumnComponent } from './column.component';

@Component({
    selector: 'ubs-table-ngx',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements AfterViewInit {
  @ContentChildren(ColumnComponent) columnsContent!: QueryList<ColumnComponent>;
  cols: { [key: string]: ColumnComponent } = {};
  colsKeys: Array<string> = [];
  @Input() items: any[] = [];

  ngAfterViewInit(): void {
    this.columnsContent.forEach((a) => {
      this.cols[a.name] = a;
      this.colsKeys.push(a.name);
    });
  }
}
