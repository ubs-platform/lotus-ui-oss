import {
  Component,
  computed,
  HostBinding,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { IIcon } from '@lotus/front-global/icon-type';

@Component({
  selector: 'lotus-web-block-part-base-button',
  templateUrl: './block-part-base-button.component.html',
  styleUrls: ['./block-part-base-button.component.scss'],
  standalone: false,
})
export class BlockPartBaseButtonComponent implements OnInit {
  readonly iconClass = input('');
  readonly iconContent = input('');
  readonly iconImageSource = input('');
  // @Input() iconType: 'class-name' | 'content' = 'class-name';
  readonly buttonClass = input('surface');
  readonly growRight = input(false);
  readonly growLeft = input(false);
  readonly disabled = input(false);
  @HostBinding('class.w-full')
  readonly cover = input(true);
  readonly iconPosition = input<'RIGHT' | 'LEFT' | 'NONE'>('LEFT');
  readonly btnTabindex = input<string>();
  readonly hideContentAtLowScr = input(false);
  readonly contentClass = input('');
  contentClassSys = computed(
    () =>
      this.contentClass() +
      (this.hideContentAtLowScr() ? 'hidden md:block' : '')
  );
  constructor() {}

  ngOnInit(): void {}
}
