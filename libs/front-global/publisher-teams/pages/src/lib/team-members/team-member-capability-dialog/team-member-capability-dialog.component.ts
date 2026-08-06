import { Component, Inject, OnInit } from '@angular/core';
import {
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
  WebdialogReference,
} from '@lotus/front-global/webdialog';
import { Capability, EOGUserCapabilityDTO, EOGUserEntityCapabilityDTO } from '@ubs-platform/users-common';
import { FeederItem } from '@lotus/front-global/minky/core';
import { applyBaseCapabilitySelectionRules, groupCapabilities } from '../common-form-options';
import { EntityCapabilityGroupConfig } from '../entity-capability-group-config';

export interface TeamMemberCapabilityDialogData {
  groups: EntityCapabilityGroupConfig[];
  /** Presence toggles the dialog between invite mode (undefined) and edit mode. */
  existing?: EOGUserCapabilityDTO;
  allowAllCapabilities?: boolean;
  allowedGroupCapabilities?: number[];
  allowedEntityCapabilities?: EOGUserEntityCapabilityDTO[];
}

export interface TeamMemberCapabilityDialogResult {
  anyLogin?: string;
  groupCapabilities: number[];
  entityCapabilities: EOGUserEntityCapabilityDTO[];
}

@Component({
  selector: 'team-member-capability-dialog',
  standalone: false,
  templateUrl: './team-member-capability-dialog.component.html',
  styleUrl: './team-member-capability-dialog.component.scss',
})
export class TeamMemberCapabilityDialogComponent implements OnInit {
  groupCapabilityOptions: FeederItem[] = groupCapabilities;

  groups: EntityCapabilityGroupConfig[] = [];
  isEditMode = false;
  allowAllCapabilities = false;
  allowedEntityCapabilities: EOGUserEntityCapabilityDTO[] | undefined;
  anyLogin = '';
  groupCapabilityValues: number[] = [];
  entityCapabilityValues: EOGUserEntityCapabilityDTO[] = [];

  constructor(
    private dial: WebdialogReference<TeamMemberCapabilityDialogResult | null>,
    @Inject(WEBDIALOG_CONFIG)
    private dialogConfig: IWebDialogConfig<
      TeamMemberCapabilityDialogData,
      TeamMemberCapabilityDialogResult | null
    >
  ) {}

  ngOnInit(): void {
    const data = this.dialogConfig.data;
    this.groups = data?.groups ?? [];
    this.allowAllCapabilities =
      data?.allowAllCapabilities === true ||
      (data?.allowedGroupCapabilities ?? []).includes(Capability.OWNER);
    this.allowedEntityCapabilities = data?.allowedEntityCapabilities;

    this.groupCapabilityOptions = this.filterGroupCapabilityOptions(
      data?.allowedGroupCapabilities,
      this.allowAllCapabilities
    );

    const existing = data?.existing;
    this.isEditMode = !!existing;
    this.groupCapabilityValues = existing ? [...(existing.groupCapabilities ?? [])] : [];
    this.entityCapabilityValues = existing ? [...(existing.entityCapabilities ?? [])] : [];
  }

  private filterGroupCapabilityOptions(
    allowedCapabilities: number[] | undefined,
    allowAllCapabilities: boolean
  ): FeederItem[] {
    if (allowAllCapabilities) {
      return groupCapabilities;
    }

    const allowedSet = new Set(allowedCapabilities ?? []);
    return groupCapabilities.filter((option) => allowedSet.has(option.value));
  }

  toggleGroupCapability(value: number, checked: boolean): void {
    const oldValue = this.groupCapabilityValues;
    const newValueRaw = checked ? [...oldValue, value] : oldValue.filter((v) => v !== value);
    this.groupCapabilityValues = applyBaseCapabilitySelectionRules(newValueRaw, oldValue);
  }

  onEntityCapabilitiesChange(value: EOGUserEntityCapabilityDTO[]): void {
    this.entityCapabilityValues = value;
  }

  get canSubmit(): boolean {
    if (this.groupCapabilityValues.length === 0) {
      return false;
    }
    return this.isEditMode || this.anyLogin.trim().length > 0;
  }

  submit(): void {
    if (!this.canSubmit) {
      return;
    }
    this.dial.close({
      anyLogin: this.isEditMode ? undefined : this.anyLogin.trim(),
      groupCapabilities: this.groupCapabilityValues,
      entityCapabilities: this.entityCapabilityValues,
    });
  }

  cancel(): void {
    this.dial.close(null);
  }
}
