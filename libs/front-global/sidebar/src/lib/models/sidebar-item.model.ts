import { IIcon } from '@lotus/front-global/icon-type';
import { Observable, of } from 'rxjs';

export interface ISidebarItem {
  path: string;
  title: string;
  icon?: IIcon;
  hidden: Observable<boolean>;
  type?: 'button' | 'category';
  subItems?: ISidebarItem[];
}

export class SidebarItem implements ISidebarItem {
  constructor(
    public path: string,
    public title: string,
    public icon?: IIcon,
    public hidden = of(false),
    public type?: 'button' | 'category',
    public subItems?: SidebarItem[]
  ) {
    if (!this.type) {
      this.type = 'button';
    }
    if (this.type === 'category' && !this.subItems) {
      this.subItems = [];
    }
  }
}
