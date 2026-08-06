import { Capability } from "@ubs-platform/users-common";

export const entityCapabilities = [
  { text: 'capability.item.OWNER', value: Capability.OWNER },
  { text: 'capability.item.VIEW', value: Capability.VIEW },
  { text: 'capability.item.ADD', value: Capability.ADD },
  { text: 'capability.item.EDIT', value: Capability.EDIT },
  { text: 'capability.item.DELETE', value: Capability.DELETE },
];

export const groupCapabilities = [
  ...entityCapabilities,
  {
    text: 'capability.item.EOG_ADJUST_CAPABILITIES',
    value: Capability.EOG_ADJUST_CAPABILITIES,
  },
  {
    text: 'capability.item.EOG_ADJUST_MEMBERS',
    value: Capability.EOG_ADJUST_MEMBERS,
  },
  {
    text: 'capability.item.EOG_EDIT_METADATA',
    value: Capability.EOG_EDIT_METADATA,
  }
];

/**
 * Base OWNER/VIEW/ADD/EDIT/DELETE mutual-exclusion rules, plus an optional
 * app/group-specific filter (e.g. route-provided `customCapabilitySelection`)
 * applied first so it can veto/adjust the selection before the base rules run.
 */
export const applyBaseCapabilitySelectionRules = (
  newValue: number[],
  oldValue: number[],
  customFilter?: (newCapabilities: number[], oldValue: number[]) => number[] | undefined
): number[] => {
  if (customFilter) {
    const candidate = customFilter(newValue, oldValue);
    if (Array.isArray(candidate)) {
      newValue = candidate;
    }
  }

  // Eğer Owner rolü seçili ise diğer tüm roller otomatik olarak kaldırılır
  if (newValue.includes(Capability.OWNER)) {
    return [Capability.OWNER];
  }

  // Eğer Owner rolü seçili iken tüm roller kaldırılırsa Owner rolü otomatik olarak eklenir
  if (oldValue.includes(Capability.OWNER) && newValue.length === 0) {
    return [Capability.VIEW, Capability.ADD, Capability.EDIT, Capability.DELETE];
  }

  // Editör rolleri seçilirse Owner rolü otomatik olarak kaldırılır
  if (newValue.includes(Capability.EDIT) ||
    newValue.includes(Capability.DELETE) ||
    newValue.includes(Capability.ADD) ||
    newValue.includes(Capability.VIEW)) {
    return newValue.filter((v) => v !== Capability.OWNER);
  }

  return newValue;
};