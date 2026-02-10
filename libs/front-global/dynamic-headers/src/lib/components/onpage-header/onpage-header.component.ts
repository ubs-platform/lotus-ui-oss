import { Component, effect, model, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderCommunicationService } from '../../services/header-communication.service';
import { TranslatorText } from '@ubs-platform/translator-core';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { screenTypeStatus } from "@lotus/front-global/mona-mobile-experience-ng"

@Component({
  selector: 'onpage-header',
  imports: [CommonModule, UbsTranslatorNgxModule],
  templateUrl: './onpage-header.component.html',
  styleUrl: './onpage-header.component.css',
})
export class OnpageHeaderComponent implements OnInit, OnDestroy {
  isDesktop = signal<boolean>(false);
  topMinimal = model<TranslatorText>("");
  content = model<TranslatorText>("");
  hideOnMobile = model<boolean>(true);

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
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.headerCommunicationService.setHeaderTitle("");
  }


}
