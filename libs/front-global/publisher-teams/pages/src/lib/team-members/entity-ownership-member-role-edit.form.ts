import {
  FeederItem,
  ListFunction,
  minky,
  minkyRoot,
  Reform,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { bookRoleOptionsFetcher, groupCapabilities, postralRoleOptionsFetcher } from './common-form-options';

@minkyRoot()
export class EntityOwnershipMemberEditForm {
  @minky({
    label: 'İçerik yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => bookRoleOptionsFetcher()
  })
  contentCapability: string = '';

  @minky({
    label: 'Grup yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => groupCapabilities
  })
  groupCapability:
    | 'OWNER'
    | 'VIEWER'
    | 'ADJUST_MEMBERS'
    | 'ONLY_EDIT_MEMBER_CAPABILITIES' = 'ADJUST_MEMBERS';


  @minky({
    label: 'Hesap yönetimi yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => postralRoleOptionsFetcher()
  })
  accountManagementCapability: string = '';

  @minky({
    label: 'Adres yönetimi yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => postralRoleOptionsFetcher()
  })
  addressManagementCapability: string = '';

  @minky({
    label: 'Vergi düzenleme yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => postralRoleOptionsFetcher()
  })
  taxManagementCapability: string = '';

  @minky({
    label: 'Ürün düzenleme yetkisi',
    inputType: 'select',
    validators: [new RequiredValidator()],
    selectItems: () => postralRoleOptionsFetcher()
  })
  itemManagementCapability: string = '';
}
