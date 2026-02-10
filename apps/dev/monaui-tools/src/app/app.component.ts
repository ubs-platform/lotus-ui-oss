import {
  AfterViewInit,
  Component,
  Inject,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TITLE_TRANSFORM,
  TitleTransform,
} from '@lotus/front-global/minky/reform-ngx';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { CustomHeaderHolderService } from '@lotus/front-global/ui/page-container';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { environment } from '@lotus-web/environment';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { NavigationEnd, Router } from '@angular/router';
import { insertIndexForUrlNavigation } from '@lotus/front-global/webdialog';

interface TranslationText {
  textByLang: { [language: string]: string };
  prefix: string;
  name: string;
  url: string;
  elementTag: string;
  elementClass: string;
}

@Component({
  selector: 'planor-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  headerTemplate = viewChild<TemplateRef<any>>('header');
  footerTemplate = viewChild<TemplateRef<any>>('footer');
  showTranslatorDialog = false;
  prefix = '';

  constructor(
    private http: HttpClient,
    @Inject(TITLE_TRANSFORM)
    public labelTransformation: TitleTransform,
    public translatorRepoService: TranslatorRepositoryService,
    public customHeaderHolder: CustomHeaderHolderService,
    public basicOverlayService: BasicOverlayService,
    public router: Router
  ) {
    router.events.subscribe((a) => {
      if (a instanceof NavigationEnd) {
        insertIndexForUrlNavigation();
      }
    });
    labelTransformation.currentTransform = (s) => {
      return translatorRepoService.getStringListenChanges(s) as any;
    };

    window.addEventListener('offline', () => {
      if (!location.pathname.startsWith('offline/book')) {
        this.basicOverlayService
          .confirm(
            'Çevrimdışı',
            'Şu an çevrimdışı görünüyorsunuz. Çevrimdışı moda geçmek ister misiniz?'
          )
          .subscribe((a) => {
            if (a) {
              this.router.navigate(['books', 'offline']);
            } else {
              this.basicOverlayService.removeAllAlerts();
              this.basicOverlayService.alert(
                'Şu an çevrimdışı görünüyorsunuz',
                'İnternet bağlantınızda sorun var gibi. Şu anda Lotus çevrimdışı kullanımlar için optimize edilmediği için sorun yaşayabilirsiniz.',
                'warn',
                true
              );
            }
          });
      }
    });

    window.addEventListener('online', () => {
      this.basicOverlayService.removeAllAlerts();
      this.basicOverlayService.alert('Şu an çevrimiçisiniz', '', 'success');
    });
  }

  ngAfterViewInit(): void {
    if (innerWidth < 712) {
      window.addEventListener('resize', function () {
        window.setTimeout(function () {
          (document.activeElement as HTMLElement)?.scrollIntoView();
        }, 0);
      });
    }

    this.customHeaderHolder.headerTemplate = this.headerTemplate();

    if (!environment.production) {
      document.addEventListener('mousedown', (e) => {
        if (e.button == 1) {
          const text = (e.target as HTMLElement).textContent;
          const tete = confirm(text!);
          if (tete) {
            this.showTranslatorDialog = true;
            if (!this.prefix || !confirm('Aynı prefixle devam?')) {
              this.prefix = prompt('Prefix') || '';
            }
            const prefix = this.prefix;
            const name = prompt('Name');
            // const turkish = prompt("Turkish");
            const english = prompt('Dingilizce');
            if (prefix && name && english) {
              this.http
                .post('http://localhost:23123/api', {
                  textByLang: {
                    'tr-tr': text,
                    'en-us': english,
                  },
                  elementClass: (e.target as HTMLElement).className,
                  elementTag: (e.target as HTMLElement).tagName,
                  prefix: prefix,
                  name,
                  url: location.href,
                } as TranslationText)
                .subscribe();
            }
          }
        }
      });
    }
  }
}
