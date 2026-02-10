import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { DialogService } from 'primeng/dynamicdialog';
import { ResolveDialogComponent } from '../resolve-dialog/resolve-dialog.component';
import { IUserMessageDto } from '@ubs-platform/feedback-common';

@Component({
    selector: 'lotus-web-feedback-details',
    templateUrl: './feedback-details.component.html',
    standalone: false
})
export class FeedbackDetailsComponent {
  userMessage?: IUserMessageDto;
  constructor(
    private userMessageService: UserMessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activeRoute.params.subscribe((a) => {
      const id = a['id'];
      if (id) {
        this.userMessageService.get(id).subscribe(
          (a) => {
            this.userMessage = a;
          },
          () => {
            this.router.navigate(['404'], { skipLocationChange: true });
          }
        );
      }
    });
  }

  resolve() {
    const dial = this.dialogService.open(ResolveDialogComponent, {
      data: this.userMessage!._id,
      width: '712px',
    });
    dial.onClose.subscribe((a: IUserMessageDto) => {
      if (a) {
        this.userMessage = a;
      }
    });
  }
}
