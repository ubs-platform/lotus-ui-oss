import { Component } from '@angular/core';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import {
  IUserMessageDto,
  IUserMessageSearch,
} from '@ubs-platform/feedback-common';
import { Reform } from '@lotus/front-global/minky/core';
import { OverlayService } from 'primeng/api';
import { UserMessageSearchForm } from '../../forms/user-message-search.form';


@Component({
  selector: 'lotus-web-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
  standalone: false,
})
export class FeedbackListComponent {
  userMessages: IUserMessageDto[] = [];
  filter: IUserMessageSearch = {};
  showFilter = false;
  readonly fetchUrl: string;
  reform!: Reform<IUserMessageSearch>;
  constructor(
    private userMessageService: UserMessageService,
    private overlay: BasicOverlayService
  ) {
    this.fetchUrl = this.userMessageService.baseUrl + '/_search';
  }

  ngOnInit(): void {
    this.fetch();
    this.initReform();
  }

  initReform() {
    this.reform = new Reform(UserMessageSearchForm, {});
  }

  private fetch() {
    this.userMessageService.getAll(this.filter).subscribe((a) => {
      this.userMessages = a;
    });
  }

  filterUpdated($event: IUserMessageSearch) {
    this.filter = $event;
    this.fetch();
  }

  remove(id: any) {
    this.overlay
      .confirm(
        'Bu geri bildirimi silmekten emin misiniz?',
        'Bu işlemi geri alamazsınız'
      )
      .subscribe((a) => {
        if (a) {
          this.userMessageService.delete(id).subscribe(() => {
            this.userMessages = this.userMessages.filter((a) => a._id != id);
          });
        }
      });
  }
}
