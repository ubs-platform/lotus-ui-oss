import {
  Component,
  EventEmitter,
  Output,
  SimpleChanges,
  input,
  model
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location as NgLocation } from '@angular/common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { DialogVisibilityReference } from '@lotus/front-global/webdialog';
@Component({
  selector: 'social-comments-bottom-bar-component',
  templateUrl: './social-comments-bottom-bar.component.html',
  styleUrl: './social-comments-bottom-bar.component.scss',
  standalone: false,
})
export class SocialCommentsBottomBarComponent {
  readonly entityGroup = input<string>('');
  readonly mainEntityName = input<string>('');
  readonly mainEntityId = input<string>('');
  readonly childEntityName = input<string>('');
  readonly childEntityId = input<string>('');
  readonly show = model(false);
  internalShow = false;
  @Output() showChange = new EventEmitter<boolean>(true);
  readonly queryParameterName = input('comments-show');
  backButtonTracker?: DialogVisibilityReference<void>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loc: NgLocation,
    private overlay: BasicOverlayService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.activatedRoute.queryParamMap.subscribe((a) => {
    //   this.internalShow = a.get(this.queryParameterName) == 'true';
    //   this.show = this.internalShow;
    //   this.showChange.emit(this.show);
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['show'] && this.show()) {
      this.internalShow = true;
      // this.backButtonTracker = this.overlay.insertBackButtonFlag(() => {
      //   this.visibleChange(false);
      // });
    }
  }

  visibleChange($event: boolean) {
    this.show.set($event);
    this.showChange.emit(this.show());
    if (!$event) {
      this.internalShow = false;
      this.backButtonTracker = undefined;
    }
  }

  // closeDialog() {
  //   this.backButtonTracker?.closeManually();
  // }
}
