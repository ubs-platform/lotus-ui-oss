import { Component, Input } from '@angular/core';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { AuthService, RoleService } from '@lotus/front-global/auth';

@Component({
    template: '',
    standalone: false
})
export class BasePageContainerComponent {
  constructor(public headerHolder: CustomHeaderHolderService) {}
}
