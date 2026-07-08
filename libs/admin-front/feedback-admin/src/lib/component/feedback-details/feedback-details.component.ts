import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserMessageService } from '@lotus/front-global/feedback-front';
import { IUserMessageDto } from '@ubs-platform/feedback-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { ResolveForm } from '../../forms/resolve.form';
import { Reform } from '@lotus/front-global/minky/core';

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
    private basicOverlay: BasicOverlayService
  ) { }

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
    const reform = new Reform<ResolveForm>(ResolveForm, {
      reply: '',
    });
    this.basicOverlay.reformDialog(
      reform, "Mesajı çözümle",
    ).subscribe(a => {
      if (a) {
        this.userMessageService.resolve(this.userMessage!._id, reform.value).subscribe(a => {
          this.userMessage = a;
        });
      }
    })
    // Webdialog alternatifi
    // const dial = this.dialogService.open(ResolveDialogComponent, {
    //   data: this.userMessage!._id,
    //   width: '712px',
    // });
    // dial.onClose.subscribe((a: IUserMessageDto) => {
    //   if (a) {
    //     this.userMessage = a;
    //   }
    // });
  }
}
