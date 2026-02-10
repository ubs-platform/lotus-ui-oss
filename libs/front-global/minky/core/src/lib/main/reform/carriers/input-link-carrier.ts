import {
  IValidatorResult,
  PropertyInputType,
  PropertyMeta,
  Validator,
} from '@lotus/front-global/minky/core';
import { ListFunction } from '../select-feeder';

export interface BaseLinkCarrier {
  carrierType: string;
  title: string;
  depth: number;
  widthRatio?: string;
}
export interface InputLinkCarrier extends BaseLinkCarrier {
  carrierType: 'INPUT';
  title: string;
  path: string;
  placeholder: string;
  depth: number;
  value: any;
  setValue: (value: any) => any;
  getFiles: () => File[];
  validators: string[];
  validationErrors: IValidatorResult[];
  inputType: PropertyInputType;
  isTouched: boolean;
  setTouched: (b: boolean) => void;
  widthRatio?: string;
  feeder?: ListFunction;
  disable: boolean;
}

export interface ActionLinkCarrier extends BaseLinkCarrier {
  carrierType: 'ACTION';
  title: string;
  depth: number;
  widthRatio?: string;

  action?: () => any;
}
export interface GroupedLinkCarrier extends BaseLinkCarrier {
  carrierType: 'GROUP';
  widthRatio?: string;
  items: LinkCarrier[];
  propertyMeta: PropertyMeta;
}

export type LinkCarrier =
  | GroupedLinkCarrier
  | ActionLinkCarrier
  | InputLinkCarrier;
