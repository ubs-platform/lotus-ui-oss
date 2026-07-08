import { Component, computed, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalPipesModule } from '@lotus/front-global/global-pipes';



@Component({
  selector: 'lib-icon',
  imports: [CommonModule, GlobalPipesModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
})
export class IconComponent {
  readonly iconClass = input('');
  readonly iconContent = input('');
  readonly iconImageSource = input('');
  readonly iconSize = input('');
  readonly styleClass = input('');
  readonly resolvedClasses = computed(() =>
    [this.iconClass(), this.styleClass()].filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0
    ).join(' ')
  );
  readonly internalIconSize = computed(() => {
    if (this.iconClass() === "material-symbols-outlined") {
      return this.iconSize() || "1.25rem";
    }
    return this.iconSize() || "1.25rem";
  });
  readonly internalIconSource = computed(() => {
    return this.iconImageSource();
  });

  @HostBinding('style.display') readonly hostDisplay = 'inline-flex';
  @HostBinding('style.align-items') readonly hostAlignItems = 'center';
  @HostBinding('style.justify-content') readonly hostJustifyContent = 'center';
  @HostBinding('style.vertical-align') readonly hostVerticalAlign = 'middle';
  // readonly icon = input<IIcon>();
}
