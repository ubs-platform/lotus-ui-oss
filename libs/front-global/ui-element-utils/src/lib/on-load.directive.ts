import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Directive({ selector: '[on-load]', standalone: true })
export class OnLoadDirective implements AfterViewInit {
  constructor(private hostElementReference: ElementRef) {}

  ngAfterViewInit(): void {
    this.initEvent.emit(this.hostElementReference.nativeElement);
  }

  @Output('on-load') initEvent: EventEmitter<Element> = new EventEmitter();

  // ngOnInit() {
  //   setTimeout(
  //     () =>
  //     10
  //   );
  // }
}
