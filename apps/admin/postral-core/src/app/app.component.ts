import {
  AfterViewInit,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { TranslatorRepositoryService } from '@ubs-platform/translator-ngx';
import { CustomHeaderHolderService } from '@lotus/front-global/ui/page-container';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { environment } from '@lotus-web/environment';
import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { NavigationEnd, Router } from '@angular/router';
import { insertIndexForUrlNavigation } from '@lotus/front-global/webdialog';
import { LoadingIndicationService } from '@lotus/front-global/user-service-wraps';
import { PaginationItem } from '@lotus/front-global/button';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { Option } from '@lotus/legendary-front/custom-select';
import { AuthManagementService } from '@lotus/front-global/auth';
import { map, of, switchMap } from 'rxjs';
import { DecimalPrecisionManager } from '@lotus/front-global/theme-management';

interface TranslationText {
  textByLang: { [language: string]: string };
  prefix: string;
  name: string;
  url: string;
  elementTag: string;
  elementClass: string;
}

@Component({
  selector: 'lotus-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit, OnInit {
  headerTemplate = viewChild<TemplateRef<any>>('header');
  footerTemplate = viewChild<TemplateRef<any>>('footer');
  showTranslatorDialog = false;
  prefix = '';
  menus = signal<Array<PaginationItem>>([]);
  teamList = signal<Array<Option>>([]);
  moneyPrecision = this.decimalPrecisionManager.precision;

  private destroyRef = inject(DestroyRef);
  showSteeringMenu = signal(false);

  constructor(
    private http: HttpClient,
    public translatorRepoService: TranslatorRepositoryService,
    public customHeaderHolder: CustomHeaderHolderService,
    public basicOverlayService: BasicOverlayService,
    public router: Router,
    private loadingService: LoadingIndicationService,
    private teamsService: PublisherTeamService,
    private authManagementService: AuthManagementService,
    private decimalPrecisionManager: DecimalPrecisionManager
  ) {
    router.events.subscribe((a) => {
      if (a instanceof NavigationEnd) {
        insertIndexForUrlNavigation();
      }
    });

    this.authManagementService.userChange().pipe(
      switchMap(user => user
        ? this.teamsService.getAll().pipe(map(teams => ({ user, teams })))
        : of({ user: null, teams: [] })
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ user, teams }) => {
      const teamList = teams.map(team => ({
        text: team.name,
        value: team.id,
      } as Option));

      // Ürün, vergi ya da adres eklerken gönderilecek takım bilgisini seçmek için kullanılıyor. Kişisel hesap seçeneği de ekleniyor çünkü bazı kullanıcılar takımlara katılmadan kişisel hesaplarıyla işlem yapmayı tercih edebilir.
      this.teamList.set(user ? [...teamList, { text: 'Kişisel hesap', value: undefined }] : []);
    });
  }

  getActiveTeamId() {
    return this.teamsService.getActiveTeamId();
  }

  setActiveTeamId(tId?: string) {
    this.teamsService.setActiveTeam(tId);
  }

  setMoneyPrecision(precision: 2 | 4) {
    this.decimalPrecisionManager.setPrecision(precision);
  }

  ngOnInit(): void {
    this.menus.set([
      {
        text: 'Kullanıcı ödeme hesapları',
        action: () => {
          this.router.navigate(["user", "payment-accounts", "account"]);
          return true;
        }
      }, {
        text: "Takımlar",
        action: () => {
          this.router.navigate(["publisher-teams"]);
          return true;
        }
      }, {
        text: "Takım davetleri",
        action: () => {
          this.router.navigate(["publisher-teams/invitations-for-me"]);
          return true;
        }
      }, {
        text: 'Admin paneli',

        action: () => {
          this.router.navigate(["admin", "payment-accounts"]);
          return true;
        }
      },
      {
        text: "Satış simülasyonu",
        action: () => {
          this.router.navigate(["sale-simulation"]);
          return true;
        }
      },

    ]);
  }

  showOfflineMode() {
    // TODO : açık olan requestlerin loadinglerini hepsini kapattır
    this.loadingService.hideAll();
    this.router.navigate(['offline', 'book']);
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
