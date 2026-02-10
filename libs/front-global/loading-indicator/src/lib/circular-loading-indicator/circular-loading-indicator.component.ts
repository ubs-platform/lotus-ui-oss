import { Component, OnInit, input } from '@angular/core';

@Component({
    selector: 'lotus-web-circular-loading-indicator',
    templateUrl: './circular-loading-indicator.component.html',
    styleUrls: ['./circular-loading-indicator.component.scss'],
    host: {
        '[style.width]': "width() + 'px'",
        '[style.height]': "width() + 'px'",
    },
    standalone: false
})
export class CircularLoadingIndicatorComponent {
  readonly width = input(100);
 
}
