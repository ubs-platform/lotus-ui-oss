import {
  AfterViewInit,
  Component,
  Inject,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { CustomHeaderHolderService } from '@lotus/front-global/ui/page-container';

@Component({
  selector: 'lotus-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  headerTemplate = viewChild<TemplateRef<HTMLDivElement>>('header');
  constructor(
    private http: HttpClient,
    public translatorRepoService: TranslatorRepositoryService,
    public customHeaderHolder: CustomHeaderHolderService
  ) {

  }

  ngAfterViewInit(): void {
    this.customHeaderHolder.headerTemplate = this.headerTemplate();
  }
}
