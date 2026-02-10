import { Component } from '@angular/core';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { BasePageContainerComponent } from '../base/base-page-container.component';
import { AuthService, RoleService } from '@lotus/front-global/auth';

@Component({
    selector: 'lotus-web-page-container',
    templateUrl: './page-container.component.html',
    styleUrls: ['./page-container.component.scss'],
    standalone: false
})
export class PageContainerComponent extends BasePageContainerComponent {
  constructor(headerHolder: CustomHeaderHolderService) {
    super(headerHolder);
  }
}
