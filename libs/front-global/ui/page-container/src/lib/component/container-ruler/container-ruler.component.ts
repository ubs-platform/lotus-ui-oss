import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'lotus-web-container-ruler',
    templateUrl: './container-ruler.component.html',
    styleUrls: ['./container-ruler.component.scss'],
    standalone: false
})
export class ContainerRulerComponent {
  rulerWidth = '1920px';
  constructor(private route: ActivatedRoute) {
    route.data.subscribe((a) => {
      const rulerWidth = a['rulerWidth'];
      if (rulerWidth) {
        this.rulerWidth = rulerWidth;
      }
    });
  }
}
