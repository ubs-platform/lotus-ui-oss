import {
  AfterViewInit,
  Component,
  computed,
  contentChildren,
  Input,
  input,
  output,
  signal,
} from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { HttpClient } from '@angular/common/http';
import { objectToQueryParameters } from '@lotus/front-global/object-to-query-parameters';
import { map, Observable } from 'rxjs';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { SearchResult } from '@ubs-platform/crud-base-common';
import { EmptyDataDirective } from '../../directives/empty-data.directive';

@Component({
  selector: 'searchable-data-table',
  standalone: false,
  templateUrl: './searchable-data-table.component.html',
  styleUrl: './searchable-data-table.component.scss',
})
export class SearchableDataTableComponent implements AfterViewInit {
  columnsContent = contentChildren(ColumnComponent);
  page = signal(0);
  maxPage = signal(0);
  pageHumanReadable = computed(() => this.page() + 1);
  cover = input(false);

  url = input('');
  // sortBy = input('');
  // sortRotation = input('');
  size = input(10);
  firstPage = signal(true);
  lastPage = signal(true);
  reformFilter = input<Reform>();
  otherFilter = input<{ [key: string]: number | string | boolean }>({});
  itemsFromResponse = signal<any[]>([]);
  itemsInternal = computed(() =>
    this.itemsFromResponse().length > 0
      ? this.itemsFromResponse()
      : this.items()
  );
  items = input<any[]>([]);
  pageFilterChange = output<{}>();

  noDataTemplateDirective = contentChildren(EmptyDataDirective);

  constructor(
    private http: HttpClient,
    private basicOverlay: BasicOverlayService
  ) {}

  decidedFilter() {

    if (this.reformFilter() != null) {
      return {...this.otherFilter(), ...(this.reformFilter()?.value || {})};
    } else {
      return this.otherFilter();
    }
  }

  clearFilter() {
    this.reformFilter()?.reset();
    this.loadData();
  }

  showFilter() {
    const reform = this.reformFilter();
    if (reform) {
      this.basicOverlay.reformDialog(reform, 'Filtrele').subscribe((a) => {
        if (a) {
          this.loadData();
        }
      });
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

  loadData() {
    const o2qp = objectToQueryParameters({
      ...this.decidedFilter(),
      page: this.page(),
      size: this.size(),
      // sortBy: this.sortBy(),
      // sortRotation: this.sortRotation()
    });

    this.http
      .get(`${this.url()}?${o2qp}`)
      .pipe(map((a) => a as SearchResult<any>))
      .subscribe((a) => {
        this.itemsFromResponse.set(a.content);
        this.lastPage.set(a.lastPage);
        this.firstPage.set(a.firstPage);
        this.maxPage.set(a.maxPagesIndex + 1);
        // this.page.set(a.page);
      });
  }

  next() {
    if (!this.lastPage()) {
      this.page.update((a) => a + 1);
      this.loadData();
    }
  }

  back() {
    if (!this.firstPage()) {
      this.page.update((a) => a - 1);
      this.loadData();
    }
  }

  ngAfterViewInit(): void {
    console.info(this.columnsContent());
  }
}
