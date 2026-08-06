import { FeederItem } from '@lotus/front-global/minky/core';
import {
  ENTITY_GROUP_POSTRAL,
  ENTITY_NAME_POSTRAL_ACCOUNT,
  ENTITY_NAME_POSTRAL_ADDRESS,
} from '@lotus/lotus-common/consts';

/**
 * Describes one selectable entity-capability row (e.g. "content", "account") in the
 * team member invite/edit dialog. Apps provide these via route `data` so this shared
 * lib stays app-agnostic.
 */
export interface EntityCapabilityGroupConfig {
  entityGroup: string;
  entityName: string;
  label: string;
  extraCapabilities?: FeederItem[];
  customCapabilitySelection?: (
    newCapabilities: number[],
    oldValue: number[]
  ) => number[] | undefined;
}

/** Route `data` key apps use to provide `EntityCapabilityGroupConfig[]`. */
export const ENTITY_CAPABILITY_GROUPS_DATA_KEY = 'entityCapabilityGroups';

/** Used when a route doesn't provide `entityCapabilityGroups` data. */
export const DEFAULT_ENTITY_CAPABILITY_GROUPS: EntityCapabilityGroupConfig[] = [
  {
    entityGroup: ENTITY_GROUP_POSTRAL,
    entityName: ENTITY_NAME_POSTRAL_ACCOUNT,
    label: 'Hesap yönetimi yetkisi',
  },
  {
    entityGroup: ENTITY_GROUP_POSTRAL,
    entityName: ENTITY_NAME_POSTRAL_ADDRESS,
    label: 'Adres yönetimi yetkisi',
  },
];
