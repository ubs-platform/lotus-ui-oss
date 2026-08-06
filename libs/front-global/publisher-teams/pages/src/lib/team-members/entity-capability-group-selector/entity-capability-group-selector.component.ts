import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FeederItem } from '@lotus/front-global/minky/core';
import { EOGUserEntityCapabilityDTO } from '@ubs-platform/users-common';
import { applyBaseCapabilitySelectionRules, entityCapabilities } from '../common-form-options';
import { EntityCapabilityGroupConfig } from '../entity-capability-group-config';

interface CapabilityRow {
  entityGroup: string;
  entityName: string;
  label: string;
  options: FeederItem[];
  capabilities: number[];
  /** Present only for route-configured groups; unconfigured/leftover rows fall back to base rules. */
  customCapabilitySelection?: (newCapabilities: number[], oldValue: number[]) => number[] | undefined;
}

@Component({
  selector: 'entity-capability-group-selector',
  standalone: false,
  templateUrl: './entity-capability-group-selector.component.html',
  styleUrl: './entity-capability-group-selector.component.scss',
})
export class EntityCapabilityGroupSelectorComponent implements OnChanges {
  @Input() groups: EntityCapabilityGroupConfig[] = [];
  @Input() value: EOGUserEntityCapabilityDTO[] = [];
  @Input() allowAllCapabilities = false;
  @Input() allowedCapabilities: EOGUserEntityCapabilityDTO[] | undefined;
  @Output() valueChange = new EventEmitter<EOGUserEntityCapabilityDTO[]>();

  rows: CapabilityRow[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groups'] || changes['value']) {
      this.rows = this.buildRows();
    }
  }

  private buildRows(): CapabilityRow[] {
    const configuredRows: CapabilityRow[] = (this.groups ?? []).map((g) => {
      const existing = (this.value ?? []).find(
        (v) => v.entityGroup === g.entityGroup && v.entityName === g.entityName
      );
      const filteredOptions = this.filterOptionsForEntity(
        [...entityCapabilities, ...(g.extraCapabilities ?? [])],
        g.entityGroup,
        g.entityName
      );

      return {
        entityGroup: g.entityGroup,
        entityName: g.entityName,
        label: "capability.entity." + g.entityGroup + "/" + g.entityName,
        options: filteredOptions,
        capabilities: existing ? [...(existing.capabilities ?? [])] : [],
        customCapabilitySelection: g.customCapabilitySelection,
      };
    });

    // Capabilities already granted on the item but no longer (or not yet) covered by
    // route config - keep them visible/editable so nothing gets silently dropped.
    const leftoverRows: CapabilityRow[] = (this.value ?? [])
      .filter(
        (v) =>
          !(this.groups ?? []).some(
            (g) => g.entityGroup === v.entityGroup && g.entityName === v.entityName
          )
      )
      .map((v) => ({
        entityGroup: v.entityGroup,
        entityName: v.entityName,
        label: "capability.entity." + v.entityGroup + "/" + v.entityName,
        options: this.filterOptionsForEntity(
          entityCapabilities,
          v.entityGroup,
          v.entityName
        ),
        capabilities: [...(v.capabilities ?? [])],
      }));

    return [...configuredRows, ...leftoverRows];
  }

  private filterOptionsForEntity(
    options: FeederItem[],
    entityGroup: string,
    entityName: string
  ): FeederItem[] {
    if (this.allowAllCapabilities) {
      return options;
    }

    const allowed = (this.allowedCapabilities ?? []).find(
      (item) => item.entityGroup === entityGroup && item.entityName === entityName
    );
    const allowedSet = new Set(allowed?.capabilities ?? []);
    return options.filter((option) => allowedSet.has(option.value));
  }

  toggle(row: CapabilityRow, capabilityValue: number, checked: boolean): void {
    const oldValue = row.capabilities;
    const newValueRaw = checked
      ? [...oldValue, capabilityValue]
      : oldValue.filter((v) => v !== capabilityValue);
    row.capabilities = applyBaseCapabilitySelectionRules(
      newValueRaw,
      oldValue,
      row.customCapabilitySelection
    );
    this.emitChange();
  }

  private emitChange(): void {
    const result: EOGUserEntityCapabilityDTO[] = this.rows.map((r) => ({
      entityGroup: r.entityGroup,
      entityName: r.entityName,
      capabilities: r.capabilities,
    }));
    this.valueChange.emit(result);
  }
}
