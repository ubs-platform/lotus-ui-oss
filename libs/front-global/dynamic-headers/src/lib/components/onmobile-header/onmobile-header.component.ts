import { Component, ElementRef, model, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderCommunicationService } from '../../services/header-communication.service';
import { TranslatorText } from '@ubs-platform/translator-core';
import { TranslatorRepositoryService, UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { screenTypeStatus } from "@lotus/front-global/mona-mobile-experience-ng"

@Component({
  selector: 'lib-onmobile-header',
  imports: [CommonModule, UbsTranslatorNgxModule],
  templateUrl: './onmobile-header.component.html',
  styleUrl: './onmobile-header.component.scss',
})
export class OnmobileHeaderComponent implements OnInit {
  content = signal<string>("");
  hideOnDesktop = model<boolean>(true);
  isMobile = signal<boolean>(false);
  topMinimal = model<TranslatorText>("");
  headerTextParent = viewChild<ElementRef<HTMLDivElement>>("headerTextParent");
  enableMarquee = signal<boolean>(false);
  approxLength = signal<number>(0);

  constructor(private headerCommunicationService: HeaderCommunicationService, private translatorService: TranslatorRepositoryService) { }

  ngOnInit(): void {
    this.headerCommunicationService.getHeaderTitle().subscribe(title => {
      const contentStr = this.translatorService.getString(title);

      this.content.set(contentStr);
      this.marquee();
    });

    this.headerCommunicationService.getTopMinimalTitle().subscribe(title => {
      this.topMinimal.set(title);
      this.marquee();
    });

    screenTypeStatus.subscribe(screenType => {
      this.isMobile.set(screenType === "mobile");
      this.marquee();
    });

    // window.addEventListener('resize', () => {
    //   this.updateSizing();
    // });

    // Initial check
    // this.updateSizing();
  }

  private marquee() {


    const htParentEl = this.headerTextParent()?.nativeElement;
    const aproxLength = this.content().length * 12;
    this.approxLength.set(aproxLength);
    // if (htParentEl) {
    //   this.enableMarquee.set(htParentEl && (aproxLength > htParentEl.clientWidth) && this.isMobile());

    // }
  }

  private updateSizing() {
    this.isMobile.set(window.innerWidth >= 1024);
  }
}
