import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { SidebarItem } from '../../models/sidebar-item.model';
import { fromPrimeIcon, IIcon } from '@lotus/front-global/icon-type';

@Component({
  selector: 'lotus-web-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  // Signals for reactive state management
  readonly categorizerDisplaying = signal(false);
  readonly currentPathTitle = signal('');
  readonly menuIcon = signal<IIcon>(fromPrimeIcon('pi pi-question'));

  // Inputs & Outputs
  readonly currentPath = input('');
  readonly title = input('');
  readonly items = input<SidebarItem[]>([]);
  readonly currentPathChange = output<string>();

  constructor() {
    // React to currentPath changes
    effect(() => {
      this.setTitlesForPath(this.currentPath());
    });
  }

  ngOnInit(): void {
    this.setTitlesForPath(this.currentPath());
  }

  changeCurrentPath(path: string | undefined): void {
    if (path == null) {
      path = ""
    }
    this.currentPathChange.emit(path);
    this.setTitlesForPath(path);
  }

  onMenuOpenChange(isOpen: boolean): void {
    this.categorizerDisplaying.set(isOpen);
  }

  private setTitlesForPath(path: string): void {
    const item = this.items().find(item => item.path === path);
    if (item) {
      this.currentPathTitle.set(item.title || '');
      this.menuIcon.set(item.icon || fromPrimeIcon('pi pi-question'));
    }
  }
}
