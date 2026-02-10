import { Component, OnInit } from '@angular/core';
/**
 * Uzay Düzlem (English: Space Surface) is a container component for
 * zooming child elements and provide ability for movement
 */
@Component({
    selector: 'ubs-uzayduzlem,ubs-space-surface',
    templateUrl: './uzayduzlem.component.html',
    styleUrls: ['./uzayduzlem.component.scss'],
    standalone: false
})
export class UzayduzlemComponent implements OnInit {
  scaling: boolean = false;
  zoomFactor: number = 1;
  pinchDistance: number = 0;
  maxHypotenus!: number;
  previousPinchValue!: number;

  private readonly MIN_ZOOM_FACT = 1;

  private readonly MAX_ZOOM_FACT = 4;

  constructor() {}

  ngOnInit(): void {}

  touchStart(e: TouchEvent) {
    // when there is 2 fingers
    if (e.touches.length === 2) {
      this.scaling = true;
      this.pinchStart(e);
    }
  }

  touchMove(e: TouchEvent) {
    // when if it is in scaling mode
    if (this.scaling) {
      this.pinchMove(e);
    }
  }

  touchEnd(e: TouchEvent) {
    // when if it is in scaling mode, exits

    if (this.scaling) {
      this.pinchEnd(e);
      this.scaling = false;
    }
  }

  pinchEnd(e: TouchEvent) {
    e.preventDefault();
  }

  pinchStart(e: TouchEvent) {
    const pinchDistance = this.hypotenus(e);
    this.previousPinchValue = pinchDistance;
    this.maxHypotenus = Math.hypot(innerHeight, innerWidth);

    e.preventDefault();
  }

  pinchMove(e: TouchEvent) {
    // max
    const pinchDistance = this.hypotenus(e);
    this.pinchDistance = pinchDistance;
    const isPositive = this.previousPinchValue < pinchDistance;
    const pinchRotation = isPositive ? 1 : -1;

    //when zooming out it shouldn't lower than ``this.MIN_ZOOM_FACT``,
    //or when zooming in it shouldn't higher than ``this.MAX_ZOOM_FACT``
    if (
      (!isPositive && this.MIN_ZOOM_FACT < this.zoomFactor) ||
      (isPositive && this.zoomFactor < this.MAX_ZOOM_FACT)
    ) {
      // thats scaling to max maxHypotenus and zoom factor is adjusted by this
      let oc = (pinchDistance * pinchRotation) / this.maxHypotenus;
      oc = oc / 2.5;
      // limits in ``this.MIN_ZOOM_FACT`` and ``this.MAX_ZOOM_FACT``
      this.zoomFactor = Math.max(
        this.MIN_ZOOM_FACT,
        Math.min(this.zoomFactor + oc, this.MAX_ZOOM_FACT)
      );
      e.preventDefault();
    }
    // previous pinch value kept for determining zooming in or out
    this.previousPinchValue = pinchDistance;
  }

  hypotenus(e: TouchEvent) {
    return Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
  }
}
