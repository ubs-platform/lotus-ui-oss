import { IIcon } from '@lotus/front-global/icon-type';
import { Observable, of } from 'rxjs';

export interface ISidebarItem {
  path: string;
  title: string;
  icon?: IIcon;
  hidden: Observable<boolean>;
  subItems?: ISidebarItem[];
}

export class SidebarItem implements ISidebarItem {
  constructor(
    public path: string,
    public title: string,
    public icon?: IIcon,
    public hidden = of(false)
  ) {}
}
