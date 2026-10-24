import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lotus-web-tile-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div class="tile-grid"><ng-content /></div>',
  styles: `
    :host {
      display: block;
      container-type: inline-size;
    }

    .tile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, 8rem);
      grid-auto-rows: 8rem;
      gap: 0.75rem;
      justify-content: start;
    }

    @container (max-width: 8rem) {
      .tile-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
})
export class TileGridComponent {}
