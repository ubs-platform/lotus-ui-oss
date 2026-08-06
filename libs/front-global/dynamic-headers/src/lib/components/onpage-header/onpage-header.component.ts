import { Component, effect, model, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { CommonModule } from '@angular/common';
import { HeaderAction, HeaderCommunicationService } from '../../services/header-communication.service';
import { TranslatorText } from '@ubs-platform/translator-core';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { screenTypeStatus } from "@lotus/front-global/mona-mobile-experience-ng"
import { IIcon } from '@lotus/front-global/icon-type';


@Component({
  selector: 'onpage-header',
  imports: [CommonModule, UbsTranslatorNgxModule, FrontGlobalButtonModule],
  templateUrl: './onpage-header.component.html',
  styleUrl: './onpage-header.component.css',
})
export class OnpageHeaderComponent implements OnInit, OnDestroy {
  isDesktop = signal<boolean>(false);
  topMinimal = model<TranslatorText>("");
  content = model<TranslatorText>("");
  hideOnMobile = model<boolean>(true);
  backAction = model<HeaderAction | null>(null);

  /**
   *
   */
  constructor(private headerCommunicationService: HeaderCommunicationService) {
    screenTypeStatus.subscribe(screenType => {
      this.isDesktop.set(screenType != "mobile");
    });
    effect(() => {
      this.headerCommunicationService.setTopMinimalTitle(this.topMinimal());
      this.headerCommunicationService.setHeaderTitle(this.content());
      this.headerCommunicationService.setHeaderBackAction(this.backAction());
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.headerCommunicationService.setHeaderTitle("");
  }


}
