import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  TemplateRef,
  ChangeDetectorRef,
  ContentChild,
  ElementRef,
  viewChild,
  signal,
  computed,
  input,
  Inject,
} from '@angular/core';
import { UserDTO } from '@ubs-platform/users-common';
import { AuthManagementService } from '@lotus/front-global/auth';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Router } from '@angular/router';
import {
  BPaginationProgrammaticComponent,
  PaginationItem,
} from '@lotus/front-global/button';
import { EnvironmentController } from '@ubs-platform/translator-core';
import { environment } from '@lotus-web/environment';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { DebugKeyValueViewComponentService } from '@lotus/front-global/debug-tools';
import { DocumentSwipeListener } from '@lotus/front-global/mobile-gestures-util';
import { FeedbackDialogService } from '@lotus/front-global/feedback-dialog';
import {
  LoadingIndicationService,
  LoadingIndicatorState,
} from '@lotus/front-global/user-service-wraps';
import { ThemeManager } from '@lotus/front-global/theme-management';
import {
  DialogVisibilityReference,
  IWebDialogConfig,
  WEBDIALOG_CONFIG,
} from '@lotus/front-global/webdialog';
import { ApplicationLogoDirective } from '../application-logo.directive';
import { ApplicationFooterDirective } from '../application-footer.directive';
import { WebdialogHandler } from 'libs/front-global/webdialog/src/lib/webdialog/webdialog-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ` <img
      *ngIf="config.data == 'HUMANKITE'"
      (click)="alert()"
      style="width: 100%;"
      src="https://imagedelivery.net/LBWXYQ-XnKSYxbZ-NuYGqQ/13d5e2da-2984-46bc-623c-0d18ce309800/banner"
    />
    <img
      *ngIf="config.data == 'ELFKING'"
      (click)="alert()"
      style="width: 100%;"
      src="https://m.media-amazon.com/images/I/61A8804S72L.jpg"
    />
    <img
      *ngIf="config.data == 'DAILY'"
      (click)="alert()"
      style="width: 100%;"
      src="/api/file/BOOK_THUMB/66eb2f1a35a0867abc8dc265"
    />

    <div>{{ testo }}</div>`,
})
export class KyleBroflovski implements OnInit {
  testo = 0;
  /**
   *
   */
  constructor(
    @Inject(WEBDIALOG_CONFIG)
    public config: IWebDialogConfig<'HUMANKITE' | 'ELFKING' | 'DAILY', void>
  ) {}
  ngOnInit() {
    setTimeout(() => (this.testo = NaN), 1000);
  }

  alert() {
    alert("don't");
    alert('touch');
    alert('me!!!!');
  }
}

@Component({
  selector: 'lotus-web-generic-app-header',
  templateUrl: './generic-app-header.component.html',
  styleUrls: ['./generic-app-header.component.scss'],
  standalone: false,
})
export class GenericAppHeaderComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @ContentChild(ApplicationLogoDirective) appLogo?: ApplicationLogoDirective;
  @ContentChild(ApplicationFooterDirective)
  appFooter?: ApplicationFooterDirective;
  // hideLogoAtScroll = input(false);
  enableUserLoginOperations = input(true);
  bgColor = input('');
  logoSrc = input('');
  showHomepageMenu = input(true);
  showIcon = input(true);

  programaticPagination = viewChild<BPaginationProgrammaticComponent>(
    'programaticPagination'
  );
  customMenus = input<Array<PaginationItem | null>>([]);
  helpMenu = input<Array<PaginationItem | null>>([]);
  // @Input() hideMainMenu = false;
  scrollingParentElement = input<String | HTMLElement | ElementRef>();
  subjectHideTrack = new Subject<boolean>();
  displayMenu = signal(false);
  darkTheme = signal(false);
  // constantMenuItems = signal<Array<PaginationItem | null>>([]);
  isInFirstPage = signal(true);
  accountMenu = signal<MenuItem[]>([]);
  user = signal<UserDTO | null | undefined>(null);
  enableUserMenu = computed(
    () => this.enableUserLoginOperations() && this.user()
  );
  userFullName = computed(() =>
    this.user()
      ? this.user()!.name + ' ' + this.user()!.surname
      : 'Giriş yapılmadı'
  );
  allMenus = computed(() => {
    return this.loadMenus();
  });
  imgUrl = computed(() => {
    return this.user() ? `/api/file/PROFILE_PHOTO/${this.user()?.id}` : '';
  });
  instantSwipeListenerSubscription?: Subscription;
  loading!: Observable<LoadingIndicatorState>;
  readonly KEY_THEME = 'theme';
  readonly KEY_AMOLED = 'amoled';
  // mainMenuDialogVisibility?: DialogVisibilityReference<void>;
  showLogoScroll: boolean = true;
  constructor(
    private authManager: AuthManagementService,
    private secOverlay: BasicOverlayService,
    private router: Router,
    private kvWin: DebugKeyValueViewComponentService,
    private swipeListener: DocumentSwipeListener,
    private feedbackDialog: FeedbackDialogService,
    private loadingIndication: LoadingIndicationService,
    private themeManager: ThemeManager,
    private changeDetector: ChangeDetectorRef,
    private webDialogHandler: WebdialogHandler
  ) {

  }

  ngOnInit(): void {
    this.loading = this.loadingIndication.getObservable();
    if (this.enableUserLoginOperations()) {
      this.authManager.userChange().subscribe((a) => {
        this.user.set(a);
      });
    }

    // this.initializeTheme();
  }

  ngAfterViewInit(): void {
    // this.addLogoHideScrollShow();

    this.loadMenus();

    this.changeDetector.detectChanges();
  }


  get onMobile() {
    return innerWidth < 768;
  }

  logout() {
    this.secOverlay
      .confirm('mona.logout', 'mona.sure-logout')
      .subscribe((status) => {
        if (status) {
          this.authManager.logout().subscribe(() => {
            this.hideMenuRaw();
            if (location.pathname != '' && location.pathname != '/') {
              this.router.navigate(['']);
            }
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {}

  // hideMenu() {
  //   this.mainMenuDialogVisibility?.closeManually();
  // }

  showMenu() {
    this.displayMenu.set(true);
    // this.mainMenuDialogVisibility = this.secOverlay.insertBackButtonFlag(() => {
    //   this.hideMenuRaw();
    // });
    // this.swipeListener.plusLot();
  }

  hideMenuRaw() {
    this.displayMenu.set(false);
    setTimeout(
      () =>
        this.programaticPagination()!.pagination()!.selectHoldAndClear('main'),
      100
    );
    // this.mainMenuDialogVisibility = undefined;
    // this.swipeListener.minusLot();
  }

  closeStateEmit() {
    this.hideMenuRaw();
  }

  ngOnDestroy(): void {
    this.instantSwipeListenerSubscription?.unsubscribe();
  }

  hideAction() {
    this.subjectHideTrack.next(true);
  }

  fish() {
    const a = ['HUMANKITE', 'ELFKING', 'DAILY'][Math.ceil(Math.random() * 2)];
    this.webDialogHandler.open(KyleBroflovski, {
      data: a,
      title: a,
      position: 'bottom-center',
      width: '500px',
      defaultOutValue: null,
    });
  }

  loadMenus() {
    const userAuthMenu = this.enableUserLoginOperations()
      ? [
          {
            templateContentName: 'logged-user',
            iconClass: 'pi-chevron-right',
            childPageContents: [
              {
                text: 'mona.account-settings',
                iconClass: PrimeIcons.USER_EDIT,
                action: () => {
                  //FIXME settimeout is not a nice pratic for waiting end of DOM ops.
                  setTimeout(() => {
                    this.router.navigate(['account', 'information']);
                  }, 350);
                  return true;
                },
              },
              {
                text: 'mona.logout',
                iconClass: PrimeIcons.SIGN_OUT,
                action: () => {
                  this.logout();
                  return true;
                },
              },
            ],
          },
          {
            templateContentName: 'unsigned-user-view',
            childPageContents: [
              {
                templateContentName: 'login-view',
              },
            ],
          },
        ]
      : [];
    const constantMenuItems = [
      ...userAuthMenu,
      {
        text: 'mona.color-theme',
        childPageContents: [
          {
            text: 'mona.dark-theme-normal',
            iconClass: PrimeIcons.MOON,
            action: () => this.themeManager.setTheme('dark'),
          },
          {
            text: 'mona.dark-theme-oled',
            iconClass: PrimeIcons.MOON,
            action: () => this.themeManager.setTheme('dark', true),
          },
          {
            text: 'mona.light-theme',
            iconClass: PrimeIcons.SUN,
            action: () => this.themeManager.setTheme('light'),
          },
          {
            text: 'mona.system-theme',
            iconClass: PrimeIcons.SYNC,
            action: () => this.themeManager.setTheme(),
          },
        ],
      },
      {
        text: 'mona.language',
        childPageContents: [
          {
            text: 'Türkçe',
            action: () => {
              EnvironmentController.getEnvironmentController().setLanguage(
                'tr-tr'
              );
              return true;
            },
            iconContent: '🇹🇷',
          },
          {
            text: 'English (US)',
            action: () => {
              EnvironmentController.getEnvironmentController().setLanguage(
                'en-us'
              );
              return true;
            },
            iconContent: '🇺🇲',
          },
        ],
      },
      {
        text: 'mona.developer',
        show: of(!environment.production),
        childPageContents: [
          {
            text: 'mona.developer.error-message',
            action: () => {
              this.secOverlay.alert(
                'mona.developer.sample-error-message',
                'mona.developer.sample-error-message',
                'error',
                true
              );
              return true;
            },
            iconClass: 'pi pi-sliders-v',
          },
          {
            text: 'Jenerik mesaj',
            action: () => {
              this.secOverlay.alert(
                'Jenerik mesaj',
                'Jenerik mesaj',
                'neutral',
                true
              );
              return true;
            },
            iconClass: 'pi pi-sliders-v',
          },
          {
            text: 'Key-Value view',
            iconClass: 'pi pi-times',
            action: () => {
              this.kvWin.showDialog();
              return true;
            },
          },
        ],
      },
    ];
    const postMenus: Array<PaginationItem | null> = [
      {
        text: 'Uygulama hakkında',
        iconClass: PrimeIcons.QUESTION,
        childPageContents: [
          ...(this.appFooter?.template
            ? [
                {
                  templateContentName: 'footer',
                },
              ]
            : []),

          ...(this.helpMenu() || []),

          {
            text: 'tetakent.support.feedback',
            iconClass: PrimeIcons.REPLY,
            action: () => {
              this.feedbackDialog.show();
              return true;
            },
          },
        ],
      },
      this.showHomepageMenu()
        ? {
            text: 'mona.home',
            iconClass: PrimeIcons.HOME,
            action: (a) => {
              this.router.navigate(['']);
              return true;
            },
          }
        : null,
    ];
    return [
      ...constantMenuItems,
      ...this.customMenus(), // console.info(

      ...postMenus,
    ];
  }
}
