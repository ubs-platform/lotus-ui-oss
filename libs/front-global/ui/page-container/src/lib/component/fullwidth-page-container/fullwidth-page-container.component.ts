import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomHeaderHolderService } from '../../service/custom-header-holder.service';
import { BasePageContainerComponent } from '../base/base-page-container.component';

@Component({
    selector: 'lotus-web-fullwidth-page-container',
    templateUrl: './fullwidth-page-container.component.html',
    styleUrl: './fullwidth-page-container.component.scss',
    standalone: false
})
export class FullwidthPageContainerComponent extends BasePageContainerComponent {
  constructor(headerHolder: CustomHeaderHolderService) {
    super(headerHolder);
  }
}
