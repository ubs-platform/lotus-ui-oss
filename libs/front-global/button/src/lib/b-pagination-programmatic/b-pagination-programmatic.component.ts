import {
  AfterViewInit,
  Component,
  contentChildren,
  ContentChildren,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  signal,
  SimpleChanges,
  viewChild,
  ViewChild,
  input
} from '@angular/core';
import { LudicString, PaginationItem } from '../pagination-item';
import { CustomItemDirective } from './custom-item-directive.directive';
import { TouchPaginationComponent } from '@lotus/front-global/ubs-touch-ngx';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

interface ChildPaginationItem {
  pagiationItems: Array<PaginationItem | null>;
  pageKey?: string;
}

@Component({
  selector: 'b-pagination-programmatic',
  templateUrl: './b-pagination-programmatic.component.html',
  styleUrls: ['./b-pagination-programmatic.component.scss'],
  standalone: false,
})
export class BPaginationProgrammaticComponent
  implements OnInit, AfterViewInit, OnChanges
{
  paginationItems = input<Array<PaginationItem | null>>([]);
  childPaginationItems = signal<ChildPaginationItem[]>([]);
  customTemplateItems = contentChildren(CustomItemDirective);
  pagination = viewChild<TouchPaginationComponent>('pagination');
  @Output() closeStateEmitted = new EventEmitter<boolean>();
  readonly height = input('80vh');
  readonly width = input('100%');
  @Output() isInFirst = new EventEmitter<boolean>(true);

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationItems']) {
    }
  }

  ngAfterViewInit(): void {
    this.fillChildItems(this.paginationItems(), '');
  }

  /**
   * Loads all other pages for pagination
   * @param paginationItems
   * @param prefix
   */
  fillChildItems(
    paginationItems: Array<PaginationItem | null>,
    prefix: string
  ) {
    paginationItems.forEach((a) => {
      //add only has child page contents
      if (a?.childPageContents) {
        //pagekey for reaching on normal paginator
        const itm: ChildPaginationItem = {
          pagiationItems: a.childPageContents,
        };
        this.childPaginationItems.update((a) => [...a, itm]);
        const pageKey = prefix + this.childPaginationItems().length.toString();
        a._pageKey = pageKey;
        itm.pageKey = pageKey;
        // and then the childrens of childrens
        this.fillChildItems(a.childPageContents, pageKey);
      }
    });
  }

  ngOnInit(): void {}

  findTemplate(arg0: string): any {
    return this.customTemplateItems()?.find((a) => a.name() == arg0)?.template;
  }

  clickAction(item: PaginationItem, pagination: TouchPaginationComponent) {
    if (item.action) {
      const status = item.action(pagination);
      if (status) {
        this.pagination()!.selectHoldAndClear('main');
        this.closeStateEmitted.emit(true);
        this.isInFirst.emit(true);
      }
    } else if (item._pageKey) {
      pagination.select(item._pageKey);
      this.isInFirst.emit(this.pagination()!.foreground() == 'main');
    }
  }
}
