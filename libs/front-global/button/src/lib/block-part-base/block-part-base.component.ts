import { Component, OnInit, input } from '@angular/core';

@Component({
    selector: 'lotus-web-block-part-base',
    templateUrl: './block-part-base.component.html',
    styleUrls: ['./block-part-base.component.scss'],
    standalone: false
})
export class BlockPartBaseComponent implements OnInit {
  readonly iconClasses = input('');
  readonly iconContent = input('');
  readonly iconImageSource = input('');
  // @Input() iconType: 'class-name' | 'content' = 'class-name';
  readonly buttonClass = input('surface');
  readonly growRight = input(false);
  readonly growLeft = input(false);
  readonly disabled = input(false);
  readonly cover = input(true);
  readonly iconPosition = input<'RIGHT' | 'LEFT' | 'NONE'>('LEFT');

  constructor() {}

  ngOnInit(): void {}
}
