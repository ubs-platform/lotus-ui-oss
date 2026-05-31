import { Component } from '@angular/core';
import { Reform } from '@lotus/front-global/minky/core';
import { PublisherRequestForm } from '../../form/publisher-request.form';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { AuthManagementService } from '@lotus/front-global/auth';
import { IUserMessageDto } from '@ubs-platform/feedback-common';
import { FileService } from '@lotus/front-global/images';
import { Observable, forkJoin, mergeMap } from 'rxjs';
import { UserMessageService } from '@lotus/front-global/feedback-front';
interface FileInformation {
  category: string;
  name: string;
}
@Component({
  selector: 'lotus-web-publisher-request',
  templateUrl: './publisher-request.component.html',
  styleUrls: ['./publisher-request.component.scss'],
  standalone: false,
})
export class PublisherRequestComponent {
  reform?: Reform<PublisherRequestForm>;
  sent = false;

  constructor(
    private overlay: BasicOverlayService,
    private authMan: AuthManagementService,
    private userMessageService: UserMessageService,
    private fileService: FileService
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authMan.userChange().subscribe((a) => {
      this.reform = new Reform<Partial<PublisherRequestForm>>(
        PublisherRequestForm
      );
      this.reform.setValueByPath('firstName', a?.name);
      this.reform.setValueByPath('lastName', a?.surname);
      this.reform.setValueByPath('email', a?.primaryEmail);
    });
  }
  submit() {
    if (this.reform) {
      if (this.reform.allValidationErrors().length) {
        this.reform.revealAllErrors();
      } else {
        const field_cv = 'cv',
          field_degree = 'degree';
        const formRawOut = this.reform.value;
        const obs: {
          [key: string]: Observable<FileInformation>;
        } = {};

        this.reform.getFiles().forEach(({ key, files }) => {
          obs[key] = this.fileService.upload(files[0], 'USER_MESSAGE');
        });

        forkJoin(obs)
          .pipe(
            mergeMap((a) => {
              const d: IUserMessageDto = {
                firstName: formRawOut.firstName,
                lastName: formRawOut.lastName,
                phoneNumber: formRawOut.phoneNumber,
                summary: 'LOTUS PUBLISHER İSTEĞİ',
                message: formRawOut.message,
                type: 'LOTUS_PUBLISHER_REQUEST',
                email: formRawOut.email!,
                fileUrls: [
                  {
                    title: 'CV/Resume',
                    url: `${a[field_cv].category}/${a[field_cv].name}`,
                  },
                  {
                    title: 'Diploma ya da E-Devlet YÖK Belgesi',
                    url: `${a[field_degree].category}/${a[field_degree].name}`,
                  },
                ],
              };
              return this.userMessageService.create(d);
            })
          )
          .subscribe((result) => {
            this.sent = true;
          });
      }
    }
  }
}
