import { Component, model, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

export type OptionalNumber = number | undefined | null;


type PopupPosition = "RIGHT" | "UP" | "LEFT" | "DOWN" | "AUTO";
const DOWN: ConnectedPosition = { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 };
const UP: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 };
const RIGHT: ConnectedPosition = { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 };
const LEFT: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 };
const POSITIONS: Record<PopupPosition, ConnectedPosition[]> = {
  AUTO: [DOWN, UP, RIGHT, LEFT],
  DOWN: [DOWN, UP, RIGHT, LEFT],
  UP: [UP, DOWN, RIGHT, LEFT],
  RIGHT: [RIGHT, LEFT, DOWN, UP],
  LEFT: [LEFT, RIGHT, DOWN, UP],
};

@Component({
  selector: 'lib-overlay-panel',
  imports: [
    OverlayModule
  ],
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
})
export class OverlayPanelComponent {
  show = signal(false);
  margin = signal<number>(20);
  maxHeight = model<OptionalNumber>(undefined);
  maxWidth = model<OptionalNumber>(undefined);
  minWidth = model<OptionalNumber>(300);
  minHeight = model<OptionalNumber>(undefined);
  origin = signal<HTMLElement | undefined>(undefined);
  positions = signal<ConnectedPosition[]>(POSITIONS.AUTO);

  showDialog(anchor: MouseEvent | HTMLElement, popupPosition: PopupPosition = "AUTO") {
    const element = anchor instanceof HTMLElement ? anchor : (anchor.currentTarget ?? anchor.target) as HTMLElement;
    this.origin.set(element);
    this.positions.set(POSITIONS[popupPosition]);
    this.show.set(true);
  }

  hideDialog() {
    this.show.set(false);
  }

  toggleDialog(anchor: MouseEvent | HTMLElement, popupPosition: PopupPosition = "AUTO") {
    if (this.show()) {
      this.hideDialog();
    } else {
      this.showDialog(anchor, popupPosition);
    }
  }
  
}
