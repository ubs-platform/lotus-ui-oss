import { NgTemplateOutlet } from '@angular/common';
import type { TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@lotus/front-global/icon';
import { PTooltipDirective } from '@lotus/front-global/overlay-panel';

export type TileTone = 'surface' | 'primary' | 'accent';

@Component({
  selector: 'lotus-web-tile-grid-item',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, IconComponent, PTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wide]': 'size() === "wide"',
    '[class.primary]': 'tone() === "primary"',
    '[class.accent]': 'tone() === "accent"',
  },
  templateUrl: './tile-grid-item.component.html',
  styleUrl: './tile-grid-item.component.scss',
})
export class TileGridItemComponent {
  readonly customContent = input<TemplateRef<any> | null | undefined>(null);
  readonly label = input.required<string>();
  readonly description = input('');
  readonly icon = input<string>();
  readonly count = input<number | undefined | null>(0);
  readonly size = input<'normal' | 'wide'>('normal');
  readonly tone = input<TileTone>('surface');
  readonly routerLink = input<string | null>(null);
  readonly action = input(false);
  readonly disabled = input(false);
  readonly activated = output<void>();
}
