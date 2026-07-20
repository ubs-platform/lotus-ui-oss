import { Component } from '@angular/core';

@Component({
  selector: 'postral-core-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {

  constructor() {
  }

  openGithub() {
    window.open('https://www.github.com/ubs-platform/postral-core', '_blank');
  }
  
  openGithubFrontend() {
    window.open('https://www.github.com/ubs-platform/lotus-ui-oss', '_blank');
  }
  openIntroductionVideo() {
    window.open('https://www.youtube.com/watch?v=JGH5RflwFqk', '_blank');
  }
}
