import { Component, input } from '@angular/core';
import { SearchableDataTableComponent } from '../searchable-data-table/searchable-data-table.component';

@Component({
  selector: 'lotus-web-searchable-data-table-filter-config-holder',
  standalone: false,
  templateUrl: './searchable-data-table-filter-config-holder.component.html',
  styleUrl: './searchable-data-table-filter-config-holder.component.scss',
})
export class SearchableDataTableFilterConfigHolderComponent {
  searchableDataTableComponent = input<SearchableDataTableComponent>();

  reformFilter() {
    return this.searchableDataTableComponent()?.reformFilter;
  }

  showFilter() {
    this.searchableDataTableComponent()?.showFilter();
  }

  clearFilter() {
    this.searchableDataTableComponent()?.clearFilter();
  }
}
