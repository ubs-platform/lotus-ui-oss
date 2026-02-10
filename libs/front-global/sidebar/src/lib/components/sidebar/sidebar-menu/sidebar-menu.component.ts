import {
  Component,
  EventEmitter,
  Output,
  input,
  model,
  computed
} from '@angular/core';
import { SidebarItem } from '../../../models';
import { fromPrimeIcon } from '@lotus/front-global/icon-type';

@Component({
  selector: 'lotus-web-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: false,
})
export class SidebarMenuComponent {
  // Constants
  readonly primeIconQuestion = fromPrimeIcon('pi pi-question');
  readonly MOBILE_BREAKPOINT = 768;

  // Inputs & Models
  readonly currentPath = model<string>();
  readonly items = input<SidebarItem[]>([]);
  readonly open = model<boolean>();

  // Outputs
  @Output() readonly currentPathChange = new EventEmitter<string>();
  @Output() readonly openChange = new EventEmitter<boolean>();

  // Computed values
  readonly isMobile = computed(() => window.innerWidth < this.MOBILE_BREAKPOINT);

  /**
   * Selects a menu item and emits the path change
   */
  select(path: string): void {
    this.currentPath.set(path);
    this.currentPathChange.emit(path);
    this.hideMenuIfMobile();
  }

  /**
   * Hides the menu on mobile devices if it's open
   */
  private hideMenuIfMobile(): void {
    if (window.innerWidth < this.MOBILE_BREAKPOINT && this.open()) {
      this.toggleMenu();
    }
  }

  /**
   * Toggles the menu open/closed state
   */
  toggleMenu(): void {
    this.open.update(isOpen => !isOpen);
    this.openChange.emit(this.open());
  }

  /**
   * TrackBy function for ngFor optimization
   */
  trackByPath(index: number, item: SidebarItem): string {
    return item.path;
  }
}
