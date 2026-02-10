import { Component, contentChildren, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BlockNavigationDirective,
  UbsTouchNgxModule,
} from '@lotus/front-global/ubs-touch-ngx';
import { BlockPartBaseButtonComponent } from 'libs/front-global/button/src/lib/block-part-base-button/block-part-base-button.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
@Component({
  selector: 'lib-tab-view',
  imports: [CommonModule, UbsTouchNgxModule, FrontGlobalButtonModule],
  templateUrl: './tab-view.component.html',
  styleUrl: './tab-view.component.css',
})
export class TabViewComponent {
  selectedTabName = signal<string>('');
  blockPages = contentChildren(BlockNavigationDirective);
}
