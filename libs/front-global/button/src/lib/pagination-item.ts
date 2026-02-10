import { TemplateRef } from '@angular/core';
import { TouchPaginationComponent } from '@lotus/front-global/ubs-touch-ngx';
import { IIcon } from '@lotus/front-global/icon-type';
import { Observable } from 'rxjs';

export interface ToggleButtonValues extends IIcon {
  value: string;
  title: string;
  iconClass?: string;
  iconContent?: string;
  iconImageSource?: string;
}

export type LudicString = string | Observable<string>;

export interface PaginationItem extends IIcon {
  _pageKey?: string;
  buttonClass?: string;
  iconClass?: string;
  iconContent?: string;
  iconImageSource?: string;
  fontClass?: string[];
  fontStyle?: string[];
  show?: Observable<boolean>;
  text?: LudicString;
  templateContentName?: string;
  customTemplate?: TemplateRef<any>;

  childPageContents?: Array<PaginationItem | null>;
  action?: (pagination: TouchPaginationComponent) => void | boolean;
  toggleValues?: ToggleButtonValues[];
  currentValue?: string;
  valueChange?: (newValue: string) => any;
  hideDefaultBackButton?: boolean;
}
