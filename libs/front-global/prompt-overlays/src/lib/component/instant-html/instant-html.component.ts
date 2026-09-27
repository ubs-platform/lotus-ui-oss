import {
  Component,
  EventEmitter,
  Output,
  SimpleChanges,
  input
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { TranslatorText } from '@lotus/extra/translator-core';

@Component({
  selector: 'instant-html',
  template: `
    <div [innerHTML]="trustedHtml"></div>
    <div class="flex gap-2">
      @if (yesButtonText()) {
        <block-button
          buttonClass="primary"
          (click)="buttonClicked.emit(true)"
          btnTabindex="-1"
          >
          {{ yesButtonText() | translate }}</block-button
          >
        }
        @if (noButtonText()) {
          <block-button
            btnTabindex="-1"
            (click)="buttonClicked.emit(false)"
            >
            {{ noButtonText() | translate }}</block-button
            >
          }
        </div>
    `,
  standalone: false,
})
export class InstantHtmlComponent {
  readonly htmlContentUrl = input('');
  readonly htmlContent = input('');
  @Output() contentLoaded = new EventEmitter<void>();
  readonly noButtonText = input<TranslatorText>();
  readonly yesButtonText = input<TranslatorText>();
  @Output() buttonClicked = new EventEmitter<boolean>();
  contentLoadedWaitViewInit = new ReplaySubject<void>(1);
  trustedHtml: any;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    // Bypassing Angular's HTML sanitizer
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['htmlContentUrl'] || changes['htmlContent']) {
      const htmlContent = this.htmlContent();
      const htmlContentUrl = this.htmlContentUrl();
      if (htmlContent) {
        this.pipeHtmlContent(htmlContent);
      } else if (htmlContentUrl) {
        this.http
          .get(htmlContentUrl, { responseType: 'string' as 'json' })
          .subscribe((a) => {
            this.pipeHtmlContent(a as string);
          });
      }
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.contentLoadedWaitViewInit.subscribe(() => {
      this.contentLoaded.emit();
    });
  }

  private pipeHtmlContent(html: string) {
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.contentLoadedWaitViewInit.next();
  }
}
