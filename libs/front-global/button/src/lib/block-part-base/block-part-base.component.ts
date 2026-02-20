import { Component, OnInit, computed, input } from '@angular/core';

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
  readonly iconSizeAuto = computed(() => {
    if (this.iconClasses().includes('material-symbols')) {
      debugger;
    }
    return this.iconClasses().includes('material-symbols') ? "1.5rem" : "0.85rem";
  });
  constructor() { }

  ngOnInit(): void { }
}
