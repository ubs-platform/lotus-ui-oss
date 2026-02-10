import { Component } from '@angular/core';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { BasePageContainerComponent } from '../base/base-page-container.component';
import { AuthService, RoleService } from '@lotus/front-global/auth';

@Component({
    selector: 'lotus-web-flexy-page-noruler-container',
    templateUrl: './flexy-page-noruler-container.component.html',
    styleUrls: ['./flexy-page-noruler-container.component.scss'],
    standalone: false
})
export class FlexyPageNoRulerContainerComponent extends BasePageContainerComponent {
  constructor(headerHolder: CustomHeaderHolderService) {
    super(headerHolder);
  }
}
