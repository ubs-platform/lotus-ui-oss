import { Component, contentChildren, HostBinding, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BlockNavigationDirective,
  UbsTouchNgxModule,
} from '@lotus/front-global/ubs-touch-ngx';
import { BlockPartBaseButtonComponent } from 'libs/front-global/button/src/lib/block-part-base-button/block-part-base-button.component';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
@Component({
  selector: 'lib-tab-view',
  imports: [CommonModule, UbsTouchNgxModule, FrontGlobalButtonModule, UbsTranslatorNgxModule],
  templateUrl: './tab-view.component.html',
  styleUrl: './tab-view.component.css',
})
export class TabViewComponent {
  selectedTabName = signal<string>('');
  readonly initialTab = input<string>('');
  readonly tabSelected = output<string>();
  // dehşet p..na sitesi gibi oldu değişken ismi sadfdsşlafksaşdlf xd
  @HostBinding('class.only-buttons')
  readonly onlyButtons = input<boolean>(false);
  touchTabView = viewChild<any>('touchTabView');
  blockPages = contentChildren(BlockNavigationDirective);

  select(tabName: string) {
    this.selectedTabName.set(tabName);
    this.touchTabView()?.select(tabName);
  }

  onTabHeaderClick(tabName: string) {
    this.select(tabName);
    this.tabSelected.emit(tabName);
  }

  onPageSelected(tabName: string) {
    this.selectedTabName.set(tabName);
  }
}
