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
  readonly iconClass = input<string | null | undefined>(undefined);
  readonly iconContent = input<string | null | undefined>(undefined);
  readonly iconImageSource = input<string | null | undefined>(undefined);
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
  readonly contentClass = input<string | null | undefined>(undefined);
  // readonly iconSizeAuto = computed(() => {
  //   if (this.iconClass() == null) return "0.85rem";
  //   return this.iconClass().includes('material-symbols') ? "1.40rem" : "0.85rem";
  // });

  contentClassSys = computed(
    () =>
      this.contentClass() +
      (this.hideContentAtLowScr() ? 'hidden md:block' : '')
  );
  constructor() { }

  ngOnInit(): void { }
}
