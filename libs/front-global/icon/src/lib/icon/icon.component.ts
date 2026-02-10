import { Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalPipesModule } from '@lotus/front-global/global-pipes';

@Component({
  selector: 'lib-icon',
  imports: [CommonModule, GlobalPipesModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  standalone: true,
})
export class IconComponent {
  readonly iconClass = input('');
  readonly iconContent = input('');
  readonly iconImageSource = input('');
  readonly iconSize = input('');
  // readonly icon = input<IIcon>();
}
