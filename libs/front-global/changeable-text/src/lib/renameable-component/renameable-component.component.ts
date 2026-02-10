import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
  SimpleChanges,
  input,
  model
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';

@Component({
    selector: 'lotus-web-changeable-text',
    templateUrl: './renameable-component.component.html',
    styleUrls: ['./renameable-component.component.scss'],
    imports: [CommonModule, FrontGlobalButtonModule, FormsModule]
})
export class ChangeableTextComponent {
  readonly value = model<string>();
  @Output() valueChange = new EventEmitter<string>();
  intervalValue = '';
  focused = false;

  // @HostListener('mouseleave', ['$event'])
  // hostMsLeaveEvent() {
  //   this.focused = false;
  // }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['value']) {
      this.intervalValue = this.value() || '';
    }
  }

  changeValue() {
    this.valueChange.emit(this.intervalValue);
    this.value.set(this.intervalValue);
    this.focused = false;
  }
}
