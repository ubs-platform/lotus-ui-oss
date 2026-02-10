import { Component, EventEmitter, Output } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { UserMessageSearchForm } from '../../forms/user-message-search.form';

import { IUserMessageSearch } from '@ubs-platform/feedback-common';


@Component({
  selector: 'lotus-web-feedback-filter',
  templateUrl: './feedback-filter.component.html',
  standalone: false,
})
export class FeedbackFilterComponent {
  readonly reform: Reform<IUserMessageSearch> = new Reform(
    UserMessageSearchForm,
    {}
  );
  @Output() valueChange = new EventEmitter<IUserMessageSearch>();
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reform.valueUpdate.subscribe((a) => {
      this.valueChange.emit(a);
    });
    this.reform.valueBigUpdate.subscribe((a) => {
      this.valueChange.emit(a);
    });
  }
}
