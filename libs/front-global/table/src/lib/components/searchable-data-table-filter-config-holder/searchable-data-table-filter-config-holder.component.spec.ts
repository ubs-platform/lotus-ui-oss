import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableDataTableFilterConfigHolderComponent } from './searchable-data-table-filter-config-holder.component';

describe('SearchableDataTableFilterConfigHolderComponent', () => {
  let component: SearchableDataTableFilterConfigHolderComponent;
  let fixture: ComponentFixture<SearchableDataTableFilterConfigHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchableDataTableFilterConfigHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SearchableDataTableFilterConfigHolderComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
