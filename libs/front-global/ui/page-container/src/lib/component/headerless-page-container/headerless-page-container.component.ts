import { Component } from '@angular/core';
import { BasePageContainerComponent } from '../base/base-page-container.component';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { AuthService, RoleService } from '@lotus/front-global/auth';

@Component({
    selector: 'lotus-web-headerless-page-container',
    templateUrl: './headerless-page-container.component.html',
    styleUrls: ['./headerless-page-container.component.scss'],
    standalone: false
})
export class HeaderlessPageContainerComponent extends BasePageContainerComponent {
  constructor(headerHolder: CustomHeaderHolderService) {
    super(headerHolder);
  }
}
