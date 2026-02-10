import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @Input() title = '';
  expanded = false;
  cursorOnContent = false;

  setCursorOnContent(val: boolean): void {
    this.cursorOnContent = val;
  }

  headerClick(): void {
    if (!this.cursorOnContent) {
      this.expanded = !this.expanded;
    }
  }
}
