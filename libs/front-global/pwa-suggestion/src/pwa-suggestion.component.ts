// catching trigger in time

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { SwUpdate } from '@angular/service-worker';
const SHOW_PWA_ADD_INFO = 'showPwaAdd';
@Component({
  selector: 'lotus-web-pwa-suggestion',
  imports: [CommonModule, FrontGlobalButtonModule],
  templateUrl: './pwa-suggestion.component.html',
  styleUrl: './pwa-suggestion.component.scss',
})
export class PwaSuggestionComponent implements OnInit {
  showAdd = localStorage.getItem(SHOW_PWA_ADD_INFO) != 'false';
  installPrompt?: { prompt: () => Promise<'accepted' | 'rejected'> };

  constructor() {}

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as any;
      console.info('FUNFACT: beforeinstallprompt çalışıyor');
    });
  }

  close() {
    localStorage.setItem(SHOW_PWA_ADD_INFO, false + '');
    this.showAdd = false;
  }

  install() {
    this.installPrompt?.prompt().then((a) => {
      //@ts-ignore
      // if (a['outcome'] == 'dismissed') {
      if (a['outcome'] == 'accepted') {
        this.showAdd = false;
      }
    });
  }
}
