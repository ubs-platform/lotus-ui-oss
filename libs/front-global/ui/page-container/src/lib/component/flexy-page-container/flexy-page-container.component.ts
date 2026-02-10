import { Component } from '@angular/core';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { BasePageContainerComponent } from '../base/base-page-container.component';
import { AuthService, RoleService } from '@lotus/front-global/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'lotus-web-flexy-page-container',
    templateUrl: './flexy-page-container.component.html',
    styleUrls: ['./flexy-page-container.component.scss'],
    standalone: false
})
export class FlexyPageContainerComponent extends BasePageContainerComponent {
  constructor(
    headerHolder: CustomHeaderHolderService,
    private route: ActivatedRoute
  ) {
    super(headerHolder);
    // route.data.subscribe((a) => alert(a['test']));
  }
}
