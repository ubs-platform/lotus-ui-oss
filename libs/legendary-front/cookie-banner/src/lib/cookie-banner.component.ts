import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
@Component({
  selector: 'landwirtde1-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  imports: [FrontGlobalButtonModule],
})
export class CookieBannerComponent implements OnInit, AfterViewInit {
  viewInitialized = false;

  constructor(/*private cookieService : CookiesService*/) {}

  ngOnInit(): void {}

  isAgreed() {
    return false;
    // return this.cookieService?.isUserAgreed();
  }

  userAgreeClick() {
    
    // this.cookieService.agreeCookieUsage();
  }

  isCookieServiceAvailable() {
    return true;
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }
}
